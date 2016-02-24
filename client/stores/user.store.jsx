/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */

import Browser from 'bowser';
import GooglePeople from './google-people.jsx';

let googlePeople = GooglePeople();
let NotificationActions;
let RoomActions;
let RTCActions;

Dependency.autorun(()=> {
  NotificationActions = Dependency.get('NotificationActions');
  RoomActions = Dependency.get('RoomActions');
  RTCActions = Dependency.get('RTCActions');
});

// UserStore Creator
var UserStore = function() {
  let _this = this;
  let currentId = null;

  // UserStore Reactive Vars
  _this.contacts = new ReactiveVar(null);
  _this.contactsError = new ReactiveVar(null);
  _this.user = Meteor.user;
  _this.userId = Meteor.userId;
  _this.loggingIn = Meteor.loggingIn;
  _this.loggingOut = new ReactiveVar(false);
  _this.loginError = new ReactiveVar(null);
  _this.logoutError = new ReactiveVar(null);
  _this.subscribed = new ReactiveVar(false);

  // only desktop version will auto-login vistors
  if (Browser.mobile || Browser.tablet) {
    AccountsGuest.enabled = true;
    AccountsGuest.forced = false;
  } else {
    AccountsGuest.enabled = true;
    AccountsGuest.forced = true;
  }

  Meteor.subscribe('user', {
    onReady() {
      _this.subscribed.set(true);
    }
  });

  Meteor.subscribe('images');

  let appContacts;
  Tracker.autorun((c)=> {
    // user is logging in or the subscription isn't ready
    if (Meteor.loggingIn() ||
      (Meteor.userId() && !_this.subscribed.get())) {
      return;
    }

    // user is not logged in or switched
    if (!Meteor.userId() || (!!currentId && currentId !== Meteor.userId())) {
      _this.contacts.set(null); // clear contacts
      NotificationActions.clearListener(currentId); // clear user notifications
      RTCActions.disconnect(currentId); // disconnect from any conversations
      appContacts = null;
    }

    // user logged in or switched
    if (Meteor.userId() &&
      (!currentId || currentId !== Meteor.userId())) {
      currentId = Meteor.userId();
      NotificationActions.registerListener(Meteor.userId());  // register notifications for the logged in user
      _this.getContacts();  // get the user's contacts
    }

    // contact tracking
    if (_this.user() && !_this.isGuest() && !!_this.user().services.google &&
      !!_this.user().services.google.contacts &&
      _this.user().services.google.contacts.length) {
      let contacts = _this.user().services.google.contacts.slice();

      // track contacts who are already using the app
      let newAppContacts = Meteor.users.find().fetch();

      // if a new user connects, we need to update the user's contacts model
      if (!!newAppContacts && !!appContacts &&
        newAppContacts.length !== appContacts.length) {
        Meteor.call('joinAppContacts', contacts);
        appContacts = newAppContacts;
        return;
      } else {
        appContacts = newAppContacts;
        let indexedAppContacts = _.indexBy(appContacts, '_id');

        // don't react to these reactive vars changing
        Tracker.nonreactive(()=> {

          // set the statuses of contacts who are app users
          if (!!contacts && contacts.length) {
            _.each(contacts, (contact)=> {
              if (!!contact._id) {
                contact.status = indexedAppContacts[contact._id] &&
                  indexedAppContacts[contact._id].status;
              }
            });
            _this.contacts.set(contacts);
          }
        });
      }
    }
  });

  // Callbacks
  _this.on = {

    loginFailed(error) {
      _this.loginError.set(error);
    },

    loginSuccess(user) {
      _this.loginError.set('');
    },

    loginStart() {
      _this.loginError.set('');
    },

    logoutFailed(error) {
      _this.logoutError.set(error);
      _this.loggingOut.set(true);
    },

    logoutStart() {
      _this.logoutError.set('');
      _this.loggingOut.set(true);
    },

    logoutSuccess() {
      _this.logoutError.set('');
      _this.loggingOut.set(false);
    },
  };

  // If user is not logged in, login as guest
  _this.requireUser = ()=> {
    return new Promise((resolve, reject)=> {
      if (Meteor.user() && _this.subscribed.get()) {
        resolve(Meteor.user());
      } else if (Meteor.loggingIn() || !_this.subscribed.get()) {

        // wait for loggingIn
        Tracker.autorun((c)=> {
          if (Meteor.loggingIn() ||
            (Meteor.user() && !_this.subscribed.get())) {
            return;
          }

          // stop the tracker
          c.stop();

          if (Meteor.user()) {
            resolve(Meteor.user());
          } else if (!(Browser.mobile || Browser.tablet)) {
            Meteor.loginVisitor(null, (err)=> {
              if (err) {
                reject(err);
              } else {
                resolve(Meteor.user());
              }
            });
          }
        });

      } else if (!(Browser.mobile || Browser.tablet)) {  // only desktop version will auto-login vistors
        Meteor.loginVisitor(null, (err)=> {
          if (err) {
            reject(err);
          } else {
            resolve(Meteor.user());
          }
        });
      }
    });
  };

  // is the user a guest user
  _this.isGuest = ()=> {
    return _this.user() && (!_this.user().services ||
    !_this.user().services.google || (
      !!_this.user().username &&
      _this.user().username.indexOf('guest-#') !== -1)
    );
  };

  _this.getContacts = ()=> {
    if (googlePeople.readyForUse) {
      // we need to wait for google to get their shit together before we can use the People API :/
      if (!_this.isGuest() && _this.user().services.google) {

        googlePeople.getContacts().then(function(res) {
          let modified = _.map(res, (val)=> {
            // we're getting buggy returns from Google People for photos right now
            let photo = val.photos ? _.find(val.photos, (photo)=> {
              return photo.metadata.primary;
            }).url : undefined;
            if (!photo || !(photo.endsWith('.jpg') || photo.endsWith('.png') ||
            photo.endsWith('.jpeg'))) {
              photo = undefined;
            }

            return {
              name: val.names ? _.find(val.names, (name)=> {
                return name.metadata.primary;
              }).displayName : undefined,
              email: val.emailAddresses ? _.find(val.emailAddresses, (email)=> {
                return email.metadata.primary;
              }).value : undefined,
              src: photo
            };
          });
          _this.contacts.set(modified);
        }, function(err) {
          console.error(err);
          _this.contactsError.set(error);
        });
      }
    } else {  // default to the Contacts API
      if (!_this.contacts.get() &&
        !_this.isGuest() && _this.user().services.google) {
        // get Google Contacts - we get this fresh every time right now
        Meteor.call('getContacts', function(err, res) {
          if (err) {
            _this.contactsError.set('could not retrieve contacts');
          } else {
            Meteor.subscribe('contacts', res);
            let contacts = res;
            Meteor.call('mergeContacts', contacts, (err, merged)=> {
              if (err) {
                console.error(err);
                _this.contactsError.set('could not merge contacts');
              } else {
                // merged
              }
            });
          }
        });
      } else if (!_this.contacts.get() && _this.isGuest()) {
        _this.contacts.set([]);
      }
    }
  };

  _this.updateProfileName = (name)=> {
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
  };

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'USER_GET_CONTACTS':
        _this.getContacts();
        break;

      case 'USER_LOGIN_PASSWORD':
        _this.on.loginStart();
        Meteor.loginWithPassword(payload.user, payload.password, (err)=> {
          if (!err) {
            _this.on.loginSuccess();
          } else {
            _this.on.loginFailed(err);
          }
        });
        break;

      case 'USER_LOGIN_GOOGLE':
        _this.on.loginStart();
        let permissions = [
          'https://www.googleapis.com/auth/contacts.readonly',
          'https://www.googleapis.com/auth/userinfo.email'];
        googlePeople.readyForUse &&
          permissions.push('https://www.googleapis.com/auth/plus.login');
        Meteor.loginWithGoogle({
          requestPermissions: permissions,
          loginStyle: (Browser.mobile || Browser.tablet) ? 'redirect' : 'popup',
          requestOfflineToken: true,
          forceApprovalPrompt: true
        }, (err)=> {
          if (!err) {
            _this.on.loginSuccess();
          } else {
            _this.on.loginFailed(err);
          }
        });
        break;

      case 'USER_LOGIN_GUEST':
        _this.on.loginStart();
        Meteor.loginVisitor(null, (err)=> {
          if (err) {
            _this.on.loginSuccess();
          } else {
            _this.on.loginFailed(err);
          }
        });
        break;

      case 'USER_LOGOUT':
        _this.on.logoutStart();
        Meteor.logout((err)=> {
          if (!err) {
            _this.on.logoutSuccess();
          } else {
            _this.on.logoutFailed(err);
          }
        });
        break;

      case 'USER_UPDATE_PROFILE_NAME':
        _this.updateProfileName(payload.name);
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('UserStore', new UserStore());
