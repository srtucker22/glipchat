import {Meteor} from 'meteor/meteor';
import {subscribe, unsubscribe} from '../utils/notification.utils';
import * as constants from '../constants/constants';

export const subscribeToNotifications = (user)=> (dispatch)=> {
  console.log('subscribeToNotifications');
  subscribe(user).then((subscriptionId)=> {
    Meteor.users.update({_id: Meteor.userId()}, {
      $addToSet: {
        'services.gcm.subscriptionIds': subscriptionId,
      },
    }, (err, res)=> {
      if(err) {
        console.error(err);
      } else {
        console.log('updated user with subscriptionId', res);
        // Meteor.call('sendNotifications', [user._id], {
        //   actions: ['join'],
        //   body: 'We have received a push message.',
        //   data: '/room',
        //   icon: '/android-icon-192x192.png',
        //   tag: 'simple-push-demo-notification-tag',
        //   title: 'Yay a message.',
        // });
      }
    });
  }, (err)=> {
    console.error(err);
  });  // build service worker and subscribe to fcm (gcm) notifications
};

// Make a request to your server to remove
// the users data from your data store so you
// don't attempt to send them push messages anymore
export const unsubscribeToNotifications = ()=> (dispatch)=> {
  console.log('unsubscribeToNotifications');
  unsubscribe().then((subscriptionId)=> {
    Meteor.users.update({_id: Meteor.userId()}, {
      $pull: {
        'services.gcm.subscriptionIds': subscriptionId,
      },
    }, (error, res)=> {
      if(error) {
        console.error(error);
        dispatch({
          type: constants.AUTH_ERROR,
          error,
        });
      } else {
        console.log('updated user removing subscriptionId', res);
      }
    });
  }, (err)=> {
    console.error(err);
  });
};
