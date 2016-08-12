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

import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { HTTP } from 'meteor/http';

const API_URL = 'https://people.googleapis.com/v1/people/me/connections';
const READY_FOR_USE = false;  // still not ready for production
// can't find a ton of contacts

export default class GooglePeople {
  constructor() {
    const _this = this;

    if (!READY_FOR_USE) {
      return;
    }

    // track changes to the user's google contacts
    Tracker.autorun((c)=> {
      if (!Meteor.user()) {
        _this.contacts = [];
        return;
      }

      if (Meteor.user() && Meteor.user().services && Meteor.user().services.google) {
        _this.contacts = Meteor.user().services.google.contacts;
      }
    });
  }

  readyForUse() {
    return READY_FOR_USE;  // Google People API is ready for production
  }

  getContacts() {
    const _this = this;
    const url = API_URL;

    const options = {
      headers: {
        'Content-Type': 'applicattption/json',
        'Authorization': `Bearer ${
          Meteor.user().services.google.accessToken
        }`,
      },
      params: {
        pageSize: 500,
      }
    };

    // if we have contacts and a syncToken, just look for contact updates
    if (Meteor.user().services.google.contacts &&
      Meteor.user().services.google.contacts.syncToken) {
      options.params.syncToken =
        Meteor.user().services.google.contacts.syncToken;
    }

    // recursive call for next page of results
    function getNextPage(nextPageToken) {
      return new Promise((resolve, reject)=> {
        let requestOptions = Object.assign({}, options);
        if (!nextPageToken) {
          requestOptions.pageToken = nextPageToken;
        }

        HTTP.get(url, options, (err, res)=> {
          if (!err) {
            if (!!res.data.nextPageToken) {
              getNextPage(res.data.nextPageToken).then((inner)=> {
                inner.data.connections.concat(res.data.connections);
                resolve(inner);
              }, (error)=> {
                reject(error);
              });
            } else {
              resolve(res);
            }
          } else {
            reject(err);
          }
        });
      });
    }

    return new Promise((resolve, reject)=> {
      function main() {
        getNextPage().then((res)=> {
          let updatedContacts = _this.contacts || {
            syncToken: res.data.nextSyncToken,
            connections: res.data.connections
          };

          // resolve changes between existing contacts and modified contacts
          let changedContacts = res.data.connections;
          if (!!changedContacts && changedContacts.length &&
            !!_this.contacts && _this.contacts.length) {
            // index the contacts by resourceName for O(n) updating
            let indexedContacts = _.indexBy(_this.contacts, 'resourceName');

            // update and add changed/new contacts
            let indexedChangedContacts = _.indexBy(changedContacts, 'resourceName');
            Object.assign(indexedContacts, indexedChangedContacts);

            // convert indexed list back to array
            updatedContacts.connections = _.map(indexedContacts, (val, key)=> {
              return val;
            });
          }

          // if updatedContacts reference has changed, we need to update user
          // if no changed/new contacts, don't update user
          if (!!changedContacts && changedContacts.length) {
            Meteor.users.update(
              {_id: Meteor.userId()},
              {
                $set: {'services.google.contacts': {
                  connections: updatedContacts.connections,
                  syncToken: updatedContacts.syncToken
                }}
              }
            );
          }
          // updated contacts start as existing contacts or first contacts return
          console.log(updatedContacts.connections);
          resolve(updatedContacts.connections);
        }, (err)=> {
          reject(err);
        });
      }

      if (Meteor.user().services.google.expiresAt &&
        moment(Meteor.user().services.google.expiresAt).isBefore(moment())) {
        Meteor.call('exchangeRefreshToken', function(err, res) {
          if (!err) {
            main();
          } else {
            reject(err);
          }
        });
      } else {
        main();
      }
    });
  }
};
