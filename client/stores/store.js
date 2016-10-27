import Browser from 'bowser';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { persistStore } from 'redux-persist';
import { Session } from 'meteor/session';
import * as constants from '../constants/constants';
import localForage from 'localForage';
import Messages from '../../lib/messages';
// import Notifications from '../../lib/notifications';
import Rooms from '../../lib/rooms';
import {AccountsGuest} from 'meteor/artwells:accounts-guest';
let store;

if (Meteor.isProduction) {
  store = require('./store.prod').default;
} else {
  store = require('./store.dev').default;
}

// force/unforce login depending on browser
AccountsGuest.enabled = true;
if(!Browser.mobile && !Browser.tablet){
  AccountsGuest.forced = true;
} else {
  AccountsGuest.forced = false;
}

// add persistence to store
persistStore(store, {storage: localForage});

// super simplified tracker -- we get all the users all the time under one subscription
Tracker.autorun(()=> {
  let available = Session.get('availableUsers');
  let room = Session.get('currentRoom');
  const sub = Meteor.subscribe('users', {
    room,
    available,
  });

  if (Meteor.loggingIn()) {
    store.dispatch({
      type: 'LOGGING_IN',
    });
  }

  if (sub.ready()) {
    const users = Meteor.users.find().fetch();
    const currentUser = Meteor.user();

    store.dispatch({
      type: constants.SET_USERS,
      users: {
        available: _.reject(users, user => (!!currentUser && user._id === currentUser._id)),
        active: _.filter(users, user => {
          return !!user.roles;
        }),
        user: currentUser,
      },
    });
  }
});

// super simplified tracker -- we get all the rooms all the time under one subscription
Tracker.autorun(()=> {
  const sub = Meteor.subscribe('rooms', {
    room: Session.get('currentRoom'),
    available: Session.get('availableRooms'),
  });

  if (sub.ready()) {
    store.dispatch({
      type: constants.SET_ROOMS,
      available: Rooms.find().fetch(),
    });
  }
});

// super simplified tracker -- we get all the chat messages for the room on one subscription
Tracker.autorun(()=> {
  const sub = Meteor.subscribe('messages', Session.get('currentRoom'));
  if (sub.ready()) {
    store.dispatch({
      type: constants.SET_MESSAGES,
      messages: Messages.find().fetch(),
    });
  }
});

// super simplified tracker -- we get all the notifications all the time under one subscription

// let initialized = false;  // wait for the first batch of cursor
// const notificationsCursor = Notifications.find({}, {
//   sort: {createdAt: -1},
// });
//
// Tracker.autorun(()=> {
//   const sub = Meteor.subscribe('notifications');
//   if (sub.ready()) {
//     store.dispatch({
//       type: constants.SET_NOTIFICATIONS,
//       notifications: notificationsCursor.fetch(),
//     });
//     initialized = true; // first batch of cursor arrived
//   }
// });
//
// // track changes to determine when to display a notification alert
// const handle = notificationsCursor.observeChanges({
//   added: function(id, fields) {
//     // wait for the first batch of cursor and user to be signed in
//     if (initialized && Meteor.userId()) {
//       // TODO: mark as read -- might need to check for unread here
//       store.dispatch({
//         type: constants.SET_ACTIVE_NOTIFICATION,
//         active: Object.assign(fields, {id}),
//       });
//     }
//   },
// });

export default store;
