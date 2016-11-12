import {_} from 'underscore';
import {APP_ICON} from '../../lib/config';
import {Meteor} from 'meteor/meteor';
import Notifications from '../../lib/notifications';

const API_KEY = Meteor.settings.push.gcm.apiKey;
const GCM_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';

export const sendNotifications = (ids, notification)=> {
  let {title, body, icon, tag, actions, data} = notification;

  const users = Meteor.users.find({_id: {$in: ids}});
  console.log(users);

  const notifications = _.flatten(users.map((user) => {
    try {
      const subscriptionIds = user.services.gcm.subscriptionIds;
      return subscriptionIds.map((subscriptionId)=> ({
        actions,
        body,
        data,
        icon: !!icon ? icon: APP_ICON,
        owner: user._id,
        sent: false,
        subscriptionId,
        tag,
        title,
      }));
    } catch (e) {
      return [];
    }
  }));

  const notificationIds = Notifications.batchInsert(notifications);

  try {
    const result = HTTP.post(GCM_ENDPOINT, {
      headers: {
        'Authorization': `key=${API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        'registration_ids': _.pluck(notifications, 'subscriptionId'),
        notification,
      },
    });

    console.log(result);
    if(result.statusCode == 200) {
      return true;
    } else {
      throw new Meteor.Error(result.statusCode, 'something went wrong');
    }
  } catch (e) {
    console.error(e);
    // Got a network error, time-out or HTTP error in the 400 or 500 range.
    throw new Meteor.Error(500, 'something went wrong');
  };
};
