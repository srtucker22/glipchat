// UserStore Creator
var UserStore = function() {
  var _this = this;

  // UserStore Reactive Vars
  _this.user = Meteor.user;
  _this.loggingIn = Meteor.loggingIn;

  _this.createError   = new ReactiveVar('');
  _this.loginError    = new ReactiveVar('');
  _this.loginOrCreate = new ReactiveVar('login');
  _this.logoutError   = new ReactiveVar('');
  _this.subscribed = new ReactiveVar(false);

  Meteor.subscribe('user', {
    onReady() {
      _this.subscribed.set(true);
    }
  });

  // Callbacks
  _this.on = {
    loginStart() {
      _this.loginOrCreate.set('login');
      _this.loginError.set('');
    },

    createStart() {
      _this.loginOrCreate.set('create');
      _this.createError.set('');
    },

    logoutStart() {
      _this.logoutError.set('');
    },

    loginFailed(error) {
      _this.loginError.set(error);
    },

    createFailed(error) {
      _this.createError.set(error);
    },

    loginOrCreateSuccess(user) {
      _this.loginError.set('');
      _this.createError.set('');
    },

    logoutFailed(error) {
      _this.logoutError.set(error);
    },

    logoutSuccess() {
      _this.logoutError.set('');
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
          if (Meteor.loggingIn() || (Meteor.user() && !_this.subscribed.get()))
            return;

          // stop the tracker
          c.stop();

          if (Meteor.user()) {
            resolve(Meteor.user());
          } else {
            Meteor.loginVisitor(null, (err)=>{
              if (err) {
                reject(err);
              } else {
                resolve(Meteor.user());
              }
            });
          };
        });

      } else {
        Meteor.loginVisitor(null, (err)=>{
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
    return _this.user() && (!_this.user().services || !_this.user().services.google || (!!_this.user().username && _this.user().username.indexOf('guest-#') !== -1));
  };

  _this.updateProfileName = (name)=> {
    Meteor.users.update({_id: Meteor.userId()}, {$set: {'profile.name': name}});
  };

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'USER_LOGIN_PASSWORD':
        _this.on.loginStart();
        Meteor.loginWithPassword(payload.user, payload.password, (err)=> {
          if (!err) {
            _this.on.loginOrCreateSuccess();
          } else {
            _this.on.loginFailed(err);
          }
        });

        break;

      case 'USER_LOGIN_FACEBOOK':
        _this.on.loginStart();
        Meteor.loginWithFacebook({
          requestPermissions: ['public_profile', 'email', 'user_friends'],
          loginStyle: Browser.mobile ? 'redirect' : 'popup',
        }, (err)=> {
          if (!err) {
            _this.on.loginOrCreateSuccess();
          } else {
            _this.on.loginFailed(err);
          }
        });

        break;

      case 'USER_LOGIN_GOOGLE':
        _this.on.loginStart();
        Meteor.loginWithGoogle({
          requestPermissions: ['https://www.googleapis.com/auth/contacts.readonly'],
          loginStyle: Browser.mobile ? 'redirect' : 'popup',
        }, (err)=> {
          if (!err) {
            _this.on.loginOrCreateSuccess();
          } else {
            _this.on.loginFailed(err);
          }
        });

        break;

      case 'USER_CREATE':
        _this.on.createStart();
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
