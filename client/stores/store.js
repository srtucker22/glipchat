// TODO: import Notifications from '../../lib/notifications';
import { _ } from 'meteor/underscore';
import { AccountsGuest } from 'meteor/artwells:accounts-guest';
import { createStore, applyMiddleware, compose } from 'redux';
import { Meteor } from 'meteor/meteor';
import { persistStore } from 'redux-persist';
import { Tracker } from 'meteor/tracker';
import Browser from 'bowser';
import localForage from 'localforage';
import thunk from 'redux-thunk';
import * as Actions from '../actions/actions';
import * as constants from '../constants/constants';
import Messages from '../../lib/messages';
import Notifications from '../../lib/notifications';
import Rooms from '../../lib/rooms';
import rootReducer from '../reducers/reducer';
import { availableRooms, availableUsers, currentRoom } from '../stores/reactive-var.store';

// Required! Enable Redux DevTools with the monitors you chose
const composeEnhancers = Meteor.isDevelopment ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose : compose;

const enhancer = composeEnhancers(
  // Middleware you want to use in development:
  applyMiddleware(thunk),
);

// Note: this API requires redux@>=3.1.0
const store = createStore(
  rootReducer,
  enhancer,
);

// force/unforce login depending on browser
AccountsGuest.enabled = true;
if (!Browser.mobile && !Browser.tablet) {
  AccountsGuest.forced = true;
} else {
  AccountsGuest.forced = false;
}

// add persistence to store
persistStore(store, { storage: localForage });

// super simplified tracker -- we get all the users all the time under one sub
let currentUser;
Tracker.autorun(() => {
  const available = availableUsers.get();
  const room = currentRoom.get();

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
    const newUser = Meteor.user();
    if (!!newUser && !!newUser.services && !!newUser.services.google &&
      (!currentUser || !currentUser._id || currentUser._id !== newUser._id)) {
      Meteor.call('getContacts', (err, contacts) => {
        if (err) {
          console.error(err);
        } else {
          // received contacts
        }
      });
      store.dispatch(Actions.subscribeToNotifications(newUser));
    } else if (!!currentUser && !newUser) {
      store.dispatch(Actions.unsubscribeToNotifications());
    }
    currentUser = newUser;

    store.dispatch({
      type: constants.SET_USERS,
      users: {
        available: _.reject(users, user => (!!currentUser && user._id === currentUser._id)),
        active: _.filter(users, user => !!user.roles),
        user: currentUser,
      },
    });
  }
});

// super simplified tracker -- we get all the rooms all the time under one sub
Tracker.autorun(() => {
  const sub = Meteor.subscribe('rooms', {
    room: currentRoom.get(),
    available: availableRooms.get(),
  });

  if (sub.ready()) {
    store.dispatch({
      type: constants.SET_ROOMS,
      available: Rooms.find().fetch(),
    });
  }
});

// super simplified tracker -- we get all chat messages for the room on one sub
Tracker.autorun(() => {
  const sub = Meteor.subscribe('messages', currentRoom.get());
  if (sub.ready()) {
    store.dispatch({
      type: constants.SET_MESSAGES,
      messages: Messages.find().fetch(),
    });
  }
});

// super simplified tracker
// we get all the notifications all the time under one subscription
let initialized = false;  // wait for the first batch of cursor
const notificationsCursor = Notifications.find({}, {
  sort: { createdAt: -1 },
});

Tracker.autorun(() => {
  const sub = Meteor.subscribe('notifications');
  if (sub.ready()) {
    store.dispatch({
      type: constants.SET_NOTIFICATIONS,
      notifications: notificationsCursor.fetch(),
    });
    initialized = true; // first batch of cursor arrived
  }
});

// track changes to determine when to display a notification alert
const handle = notificationsCursor.observeChanges({
  added(id, fields) {
    // wait for the first batch of cursor and user to be signed in
    if (initialized && Meteor.userId()) {
      store.dispatch({
        type: constants.SET_ACTIVE_NOTIFICATION,
        active: Object.assign(fields, { id }),
      });
    }
  },
});

export default store;
