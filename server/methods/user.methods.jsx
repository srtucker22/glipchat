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

Future = Npm.require('fibers/future');

// Function wrapping code.
// fn - reference to function.
// context - what you want "this" to be.
// params - array of parameters to pass to function.
let wrapFunction = function(fn, context, params) {
  return function() {
    fn.apply(context, params);
  };
};

function ThrottledRequester(rate, milliseconds) {
  // making a throttled requester:
  let busy = false;
  let requests = [];
  let fulfilled = [];

  return {
    makeRequest(req) {
      if (req) {
        requests.push(req);
      }

      if (requests.length) {
        let nextTick = fulfilled.length && _.first(fulfilled).clone().add(milliseconds, 'milliseconds');
        if (fulfilled.length < rate || (nextTick && moment().isAfter(nextTick))) {
          (requests.shift())();
          fulfilled.push(moment());
          fulfilled = _.last(fulfilled, rate);
          this.makeRequest();
        } else {
          if (!busy) {
            busy = true;
            Meteor.setTimeout(()=> {
              busy = false;
              this.makeRequest();
            }, milliseconds);
          }
        }
      }
    }
  };
}

// create request queue for Google Contacts API limited to 10 req/sec
let contactsRequester = new ThrottledRequester(10, 1000);

function googleContacts(user) {
  opts = {
    email: user.services.google.email,
    consumerKey: Meteor.settings.google.clientId,
    consumerSecret: Meteor.settings.google.clientSecret,
    token: user.services.google.accessToken,
    refreshToken: user.services.google.refreshToken
  };

  gcontacts = new GoogleContacts(opts);

  let refreshAccessTokenSync =
    Meteor.wrapAsync(gcontacts.refreshAccessToken, gcontacts);

  let accessToken = refreshAccessTokenSync(opts.refreshToken);
  gcontacts.token = accessToken;

  return gcontacts;
}

// room access server methods
Meteor.methods({
  // create a room and get access
  getContacts() {
    check(arguments, Match.OneOf({}, undefined, null));

    this.unblock();

    let user = Meteor.users.findOne(this.userId);

    // this function is now async
    var fut = new Future();

    gcontacts = googleContacts(user);

    // callback updates the user with their contacts from Google
    let callback = Meteor.bindEnvironment((err, contacts)=> {
      // return the contacts
      fut.return(contacts);
    });

    contactsRequester.makeRequest(
      wrapFunction(gcontacts.getContacts, gcontacts, [callback]) // get the contacts from google
    );

    // return the promise
    return fut.wait();
  },

  // get the contact photo from google and store to filesystem
  // need to throttle requests 10/sec
  getContactPhoto(contact) {
    check(contact, Match.ObjectIncluding({photoUrl: String}));

    this.unblock();

    let user = Meteor.users.findOne(this.userId);

    // photo fileName
    let fileName = user.services.google.id + '_' +
      _.last(contact.photoUrl.split('/')) + '.png';

    // look for existing file
    let existingFile = Images.findOne({'original.name': fileName});
    if (!!existingFile) {
      return existingFile._id;
    }

    // this function is now async
    var fut = new Future();

    // create the google contacts object
    gcontacts = googleContacts(user);

    // callback creates FS.File from binaryData
    let callback = Meteor.bindEnvironment((err, binaryData)=> {
      if (err) {
        console.log(err);
        fut.return(null);
      } else {
        let newFile = new FS.File();
        let attatchDataSync = Meteor.wrapAsync(newFile.attachData, newFile);
        let res = attatchDataSync(binaryData, {type: 'image/png'});
        // name the file {googleId}_{contactId}.png with user as owner
        newFile.name(fileName);
        newFile.owner = this.userId;

        let image = Images.insert(newFile);

        // return the image id
        fut.return(image._id);
      }
    });

    // add the request to a queue that will execute without getting throttled
    contactsRequester.makeRequest(
      wrapFunction(gcontacts.getPhoto, gcontacts, [contact.photoUrl, callback]) // get the binary image data from google
    );

    // return the promise
    return fut.wait();
  }
});
