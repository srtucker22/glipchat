import {check, Match} from 'meteor/check';
import {GoogleContacts} from 'meteor/long:google-contacts';
import {Meteor} from 'meteor/meteor';
import ThrottledRequester from '../lib/throttled-requester';
import Images from '../../lib/images';

// create request queue for Google Contacts API limited to 10 req/sec
const contactsRequester = new ThrottledRequester(10, 1000);

const googleContacts = (user)=> {
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

const joinAppContacts = (user, contacts)=> {
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

  return contacts;
};

const mergeContacts = (user, contacts)=> {
  if (!!user.services && !!user.services.google &&
    user.services.google.contacts) {

    // index the array by id
    const indexedExistingContacts = _.indexBy(user.services.google.contacts, 'id');

    const newContacts = [];

    _.each(contacts, (contact)=> {
      if (!!indexedExistingContacts[contact.id]) {
        // modify by reference
        _.extend(indexedExistingContacts[contact.id], contact);
      } else {
        newContacts.push(contact);
      }
    });
    contacts = user.services.google.contacts.concat(newContacts);
  }

  return contacts;
};

const storeContactImages = (user, contacts)=> {
  // create the google contacts object
  const gcontacts = googleContacts(user);

  // create array of promises for contacts without profile photos
  const promises = _.map(_.filter(contacts, (c) => !c.src), (contact)=> {
    const fileName = `${user.services.google.id}_${_.last(contact.photoUrl.split('/'))}.png`;

    return new Promise((res, rej)=> {
      // callback creates Image from binaryData
      let callback = Meteor.bindEnvironment((err, binaryData)=> {
        if (err) {
          console.error(err);
          res(null);
        } else {
          Images.write(binaryData, {
            fileName,
            type: 'image/png',
            meta: {owner: user._id},
          }, (error, fileRef)=> {
            if (error) {
              console.error(error);
              rej(error);
            } else {
              console.log(fileRef);
              contact.src = Images.link(fileRef);
              res(fileRef);
            }
          });
        }
      });

      // add the request to a queue that will execute without getting throttled
      // get the binary image data from google
      contactsRequester.makeRequest(
        gcontacts.getPhoto, gcontacts, [contact.photoUrl, callback]
      );
    });
  });

  return Promise.all(promises).then((res)=> {
    Meteor.users.update(
      {_id: user._id},
      {$set: {'services.google.contacts': contacts}}
    );
    return contacts;
  });
};

const getContacts = (user) => {
  return new Promise((res, rej)=> {
    gcontacts = googleContacts(user);

    // callback updates the user with their contacts from Google
    let callback = Meteor.bindEnvironment((err, contacts)=> {
      // return the contacts
      res(contacts);
    });

    // get the contacts from google
    contactsRequester.makeRequest(
      gcontacts.getContacts, gcontacts, [callback]
    );
  });
};
// room access server methods
Meteor.methods({
  // create a room and get access
  getContacts() {
    check(arguments, Match.OneOf({}, undefined, null));

    this.unblock();

    let user = Meteor.users.findOne(this.userId);

    return getContacts(user).then((contacts)=> {
      // merge old google contacts with new results
      return Promise.resolve(mergeContacts(user, contacts));
    }).then((contacts)=> {
      // join app users with google contacts
      return Promise.resolve(joinAppContacts(user, contacts));
    }).then((contacts)=> {
      // download and store all the contact images
      Meteor.defer(storeContactImages.bind(this, user, contacts));

      // update the user model's contacts
      const res = Meteor.users.update(
        {_id: user._id},
        {$set: {'services.google.contacts': contacts}}
      );

      // currently just return the contacts
      return res;
    });
  },
});
