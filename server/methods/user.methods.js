import {check, Match} from 'meteor/check';
import {GoogleContacts} from 'meteor/long:google-contacts';
import {Meteor} from 'meteor/meteor';
import Future from 'fibers/future';
import ThrottledRequester from '../lib/throttled-requester';

// create request queue for Google Contacts API limited to 10 req/sec
const contactsRequester = new ThrottledRequester(10, 1000);

const googleContacts = (user)=> {
  const opts = {
    email: user.services.google.email,
    consumerKey: Meteor.settings.google.clientId,
    consumerSecret: Meteor.settings.google.clientSecret,
    token: user.services.google.accessToken,
    refreshToken: user.services.google.refreshToken
  };

  const gcontacts = new GoogleContacts(opts);

  const refreshAccessTokenSync =
    Meteor.wrapAsync(gcontacts.refreshAccessToken, gcontacts);

  const accessToken = refreshAccessTokenSync(opts.refreshToken);
  gcontacts.token = accessToken;

  return gcontacts;
}

const getContactPhoto = (user, contact)=> {
  // photo fileName
  const fileName = `${user.services.google.id}_${_.last(contact.photoUrl.split('/'))}.png`;

  // look for existing file
  let existingFile = Images.findOne({
    'original.name': fileName
  });
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
}

const mergeContacts = (user, contacts)=> {
  if (!!user.services && !!user.services.google && user.services.google.contacts) {
    // index the array by id
    const indexedExistingContacts = _.indexBy(contacts, 'id');

    const newContacts = [];

    _.each(contacts, (contact)=> {
      if (!!indexedExistingContacts[contact.id]) {
        _.extend(indexedExistingContacts[contact.id], contact); // modify by reference
      } else {
        newContacts.push(contact);
      }
    });
    contacts = contacts.concat(newContacts);
  }

  return contacts;
}

const storeContactImages = (user, contacts)=> {
  // create the google contacts object
  const gcontacts = googleContacts(user);

  // create array of promises for contacts without profile photos
  const promises = _.map(_.filter(contacts, c => !c.src), (contact)=> {
    const filename = `${user.services.google.id}_${_.last(contact.photoUrl.split('/'))}.png`;

    return new Promise((res, rej)=> {
      // callback creates Image from binaryData
      let callback = Meteor.bindEnvironment((err, binaryData)=> {
        if (err) {
          console.error(err);
          res(null);
        } else {
          // TODO: do stuff with binaryData
          // --> convert to image and store with public url
          // add c.src = url
          // resolve c
          console.log('binaryData', binaryData);
          res(binaryData);
        }
      });

      // add the request to a queue that will execute without getting throttled
      contactsRequester.makeRequest(
        gcontacts.getPhoto, gcontacts, [contact.photoUrl, callback] // get the binary image data from google
      );
    })
  });

  Promise.all(promises).then((res)=> {

  });
}

const getContacts = (user) => {
  return new Promise((res, rej)=> {
    gcontacts = googleContacts(user);

    // callback updates the user with their contacts from Google
    let callback = Meteor.bindEnvironment((err, contacts)=> {
      // return the contacts
      res(contacts);
    });

    contactsRequester.makeRequest(
      gcontacts.getContacts, gcontacts, [callback] // get the contacts from google
    );
  });
}
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
      console.log('contacts', contacts);
      // download and store all the contact images
      Meteor.defer(storeContactImages.bind(this, user, contacts));

      // update the user model's contacts
      const res = Meteor.users.update(
        {_id: user._id},
        {$set: {'services.google.contacts': contacts}}
      );

      // currently just return the contacts
      return contacts;
    });
  },
});
