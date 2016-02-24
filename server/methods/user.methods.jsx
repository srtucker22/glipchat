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

import Future from 'fibers/future';

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

function getContactPhoto(user, contact) {
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
      console.error(err);
      fut.return(null);
    } else {
      let newFile = new FS.File();
      let attatchDataSync = Meteor.wrapAsync(newFile.attachData, newFile);
      let res = attatchDataSync(binaryData, {type: 'image/png'});
      // name the file {googleId}_{contactId}.png with user as owner
      newFile.name(fileName);
      newFile.owner = user._id;

      let image;
      try {
        image = Images.insert(newFile);
        fut.return(image._id);
      } catch (e) {
        // the image upload failed, so let's remove the image from the collection
        if (!!image) {
          Images.remove({
            _id: image._id
          });
        } else {
          Images.remove({
            name: fileName,
            owner: user._id
          });
        }
        console.error(e);
        fut.return(null);
      }
    }
  });

  // add the request to a queue that will execute without getting throttled
  contactsRequester.makeRequest(
    gcontacts.getPhoto, gcontacts, [contact.photoUrl, callback] // get the binary image data from google
  );

  // return the promise
  return fut.wait();
}

function joinAppContacts(user, contacts) {
  // get all the contacts who are existing app users
  let appContacts = Meteor.users.find({
    'services.google.email': {$in: _.pluck(contacts, 'email')},
  }).fetch();

  // index the updatedContacts by email
  let indexedUpdatedContacts = _.indexBy(contacts, 'email');
  // update contacts with app userId
  _.each(appContacts, (contact)=> {
    indexedUpdatedContacts[contact.services.google.email]._id = contact._id;
  });

  // update the user model's contacts
  let res = Meteor.users.update(
    {_id: user._id},
    {$set: {'services.google.contacts': contacts}}
  );

  return contacts;
}

function storeContactImages(userId, updatedContacts) {
  let user = Meteor.users.findOne({_id: userId});
  let imageQueue = {};
  let loopFinished = false;
  _.each(updatedContacts, (contact)=> {
    if (!contact.src && contact.photoUrl) {
      imageQueue[contact.id] = true;
      // call server to request photo from google or retrieve from storage
      Meteor.defer(()=> {
        function completeUpdate(contactId) {
          delete imageQueue[contactId];
          if (loopFinished && !_.keys(imageQueue).length) {
            Meteor.users.update(
              {_id: userId},
              {$set: {'services.google.contacts': updatedContacts}}
            );
          }
        }

        let id = getContactPhoto(user, contact);
        if (!!id) {
          let cursor = Images.find(id);
          let images = cursor.fetch();
          // update contact with the image url once image is loaded
          if (!!images && images.length && images[0].url()) {
            contact.src = images[0].url();
            completeUpdate(contact.id);
          } else {
            let timeout;

            // hack to deal with CollectionFS bug
            // github.com/CollectionFS/Meteor-CollectionFS/issues/323
            let liveQuery = cursor.observe({
              changed: function(newImage, oldImage) {
                if (newImage.url() !== null) {
                  !!timeout && Meteor.clearTimeout(timeout);
                  liveQuery.stop();
                  contact.src = newImage.url();
                  completeUpdate(contact.id);
                }
              }
            });

            timeout = Meteor.setTimeout(()=> {
              Images.remove(id);
              liveQuery.stop(); // after 30 secs, stop waiting and remove image
              completeUpdate(contact.id);
            }, 30000);
          }
        } else {
          completeUpdate(contact.id);
        }
      });
    }
  });
  loopFinished = true;
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
      gcontacts.getContacts, gcontacts, [callback] // get the contacts from google
    );

    // return the promise
    return fut.wait();
  },

  // get the contact photo from google and store to filesystem
  // need to throttle requests 10/sec
  getContactPhoto(contact) {
    check(contact, Match.ObjectIncluding({photoUrl: String}));

    this.unblock();

    let user = Meteor.user();

    return getContactPhoto(user, contact);
  },
  joinAppContacts(contacts) {
    this.unblock();

    let user = Meteor.user();

    return joinAppContacts(user, contacts);
  },
  mergeContacts(contacts) {
    this.unblock();

    let user = Meteor.user();

    // merge passed contacts with existing user google contacts
    if (!!user && !!user.services.google && user.services.google.contacts) {
      let indexedExistingContacts = _.indexBy(contacts, 'id');

      _.each(contacts, (contact)=> {
        if (!!indexedExistingContacts[contact.id]) {
          _.extend(indexedExistingContacts[contact.id], contact);
        } else {
          indexedExistingContacts[contact.id] = contact;
        }
      });
    }

    contacts = joinAppContacts(user, contacts);

    // download and store all the contact images
    storeContactImages(this.userId, contacts);

    return contacts;
  }
});
