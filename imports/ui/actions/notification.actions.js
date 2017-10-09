import { Meteor } from 'meteor/meteor';
import { subscribe, unsubscribe } from '../utils/notification.utils';
import * as constants from '../constants/constants';

export const markAllNotificationsRead = () => (dispatch) => {
  Meteor.call('markAllNotificationsRead', (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return dispatch({
        type: constants.NOTIFICATION_ERROR,
        error,
      });
    }

    return dispatch({
      type: constants.MARK_ALL_NOTIFICATIONS_READ,
    });
  });
};

export const markNotificationRead = id => (dispatch) => {
  Meteor.call('markNotificationRead', id, (error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return dispatch({
        type: constants.NOTIFICATION_ERROR,
        error,
      });
    }

    return dispatch({
      type: constants.MARK_NOTIFICATION_READ,
      id,
    });
  });
};

export const subscribeToNotifications = user => (dispatch) => {
  console.log(constants.NOTIFICATIONS_SUBSCRIPTION_START);
  dispatch({
    type: constants.NOTIFICATIONS_SUBSCRIPTION_START,
  });
  subscribe(user).then((subscriptionId) => {
    dispatch({
      type: constants.NOTIFICATIONS_SUBSCRIPTION_SUCCESS,
      subscriptionId,
    });
    console.log(constants.NOTIFICATIONS_SUBSCRIPTION_SUCCESS);
    Meteor.users.update({ _id: Meteor.userId() }, {
      $addToSet: {
        'services.gcm.subscriptionIds': subscriptionId,
      },
    }, (error) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        dispatch({
          type: constants.NOTIFICATIONS_SUBSCRIPTION_ERROR,
          error,
        });
      } else {
        console.log('updated user with subscriptionId', subscriptionId);
      }
    });
  }, (error) => {
    dispatch({
      type: constants.NOTIFICATIONS_SUBSCRIPTION_ERROR,
      error,
    });
    // eslint-disable-next-line no-console
    console.error(error);
  });  // build service worker and subscribe to fcm (gcm) notifications
};

// Make a request to your server to remove
// the users data from your data store so you
// don't attempt to send them push messages anymore
export const unsubscribeToNotifications = () => (dispatch) => {
  console.log('unsubscribeToNotifications');
  unsubscribe().then((subscriptionId) => {
    Meteor.users.update({ _id: Meteor.userId() }, {
      $pull: {
        'services.gcm.subscriptionIds': subscriptionId,
      },
    }, (error, res) => {
      if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        dispatch({
          type: constants.AUTH_ERROR,
          error,
        });
      } else {
        console.log('updated user removing subscriptionId', res);
      }
    });
  }, (err) => {
    // eslint-disable-next-line no-console
    console.error(err);
  });
};
