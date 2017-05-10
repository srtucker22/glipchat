import { _ } from 'meteor/underscore';
import stream from 'stream';
import { check, Match } from 'meteor/check';
import { GoogleContacts } from 'meteor/long:google-contacts';
import { Meteor } from 'meteor/meteor';
import ThrottledRequester from '../lib/throttled-requester';
import { ImageStore } from '../../lib/images';

const bufferToStream = (buffer) => {
  const bufferStream = new stream.PassThrough();
  bufferStream.end(buffer);
  return bufferStream;
};

// create request queue for Google Contacts API limited to 10 req/sec
const contactsRequester = new ThrottledRequester(10, 1000);

const googleContacts = (user) => {
  const opts = {
    email: user.services.google.email,
    consumerKey: Meteor.settings.google.clientId,
    consumerSecret: Meteor.settings.google.clientSecret,
    token: user.services.google.accessToken,
    refreshToken: user.services.google.refreshToken,
  };

  const gcontacts = new GoogleContacts(opts);

  const refreshAccessTokenSync =
    Meteor.wrapAsync(gcontacts.refreshAccessToken, gcontacts);

  const accessToken = refreshAccessTokenSync(opts.refreshToken);
  gcontacts.token = accessToken;

  return gcontacts;
};

const joinAppContacts = (user, contacts) => {
  // get all the contacts who are existing app users
  const appContacts = Meteor.users.find({
    'services.google.email': { $in: _.pluck(contacts, 'email') },
  }).fetch();

  // index the updatedContacts by email
  const indexedUpdatedContacts = _.indexBy(contacts, 'email');

  // update contacts with app userId
  _.each(appContacts, (contact) => {
    indexedUpdatedContacts[contact.services.google.email]._id = contact._id;
  });

  console.log('joinAppContacts', new Date());
  return contacts;
};

const mergeContacts = (user, contacts) => {
  if (!!user.services && !!user.services.google &&
    user.services.google.contacts) {
    // index the array by id
    const indexedExistingContacts = _.indexBy(user.services.google.contacts, 'id');

    const newContacts = [];

    _.each(contacts, (contact) => {
      if (indexedExistingContacts[contact.id]) {
        // modify by reference
        _.extend(indexedExistingContacts[contact.id], contact);
      } else {
        newContacts.push(contact);
      }
    });

    // eslint-disable-next-line no-param-reassign
    contacts = user.services.google.contacts.concat(newContacts);
  }
  console.log('mergeContacts', new Date());

  return contacts;
};

const storeContactImages = (user, contacts) => {
  const self = this;
  console.log('starting storeContactImages', new Date());

  // create the google contacts object
  const gcontacts = googleContacts(user);
  const getPhotoSync = Meteor.wrapAsync(gcontacts.getPhoto, gcontacts);

  // create array of promises for contacts without profile photos
  const promises = _.map(_.filter(contacts, c => !c.src), (contact) => {
    const fileName = `${user.services.google.id}_${_.last(contact.photoUrl.split('/'))}.png`;

    return new Promise((res) => {
      // callback creates Image from binaryData
      const callback = (err, binaryData) => {
        // let errors pass through
        if (err) {
          console.error(err);
          res(null);
        } else {
          const fileId = ImageStore.create({
            owner: user._id,
            name: fileName,
            type: 'image/png',
          });

          const newStream = bufferToStream(binaryData);

          ImageStore.write(newStream, fileId, function(error, file) {
            if (error) {
              console.error(err);
            } else {
              // eslint-disable-next-line no-param-reassign
              contact.src = file.path;
              res(file);
            }
          });
        }
      };

      // add the request to a queue that will execute without getting throttled
      // get the binary image data from google
      contactsRequester.makeRequest(
        getPhotoSync, self, [contact.photoUrl, callback],
      );
    });
  });

  return Promise.all(promises).then(() => {
    Meteor.users.update(
      { _id: user._id },
      { $set: { 'services.google.contacts': contacts } },
    );
    console.log('ending storeContactImages', new Date());
    return contacts;
  });
};

const getContacts = user => new Promise((res) => {
  const gcontacts = googleContacts(user);

  // callback updates the user with their contacts from Google
  const callback = Meteor.bindEnvironment((err, contacts) => {
    // return the contacts
    console.log('getContacts', new Date());
    res(contacts);
  });

  // get the contacts from google
  contactsRequester.makeRequest(gcontacts.getContacts, gcontacts, [callback]);
});
// room access server methods
Meteor.methods({
  // create a room and get access
  getContacts(args) {
    check(args, Match.Optional({}));

    this.unblock();

    const user = Meteor.users.findOne(this.userId);

    return getContacts(user).then(contacts =>
      // merge old google contacts with new results
      Promise.resolve(mergeContacts(user, contacts)),
    ).then(contacts =>
      // join app users with google contacts
      Promise.resolve(joinAppContacts(user, contacts)),
    ).then((contacts) => {
      // update the user model's contacts
      const res = Meteor.users.update(
        { _id: user._id },
        { $set: { 'services.google.contacts': contacts } },
      );

      // download and store all the contact images
      Meteor.defer(storeContactImages.bind(this, user, contacts));

      // currently just return the contacts
      return res;
    });
  },
});
