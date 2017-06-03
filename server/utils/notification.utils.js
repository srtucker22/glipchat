import { HTTP } from 'meteor/http';
import { _ } from 'underscore';
import { Meteor } from 'meteor/meteor';
import { APP_ICON } from '../../lib/config';
import Notifications from '../../lib/notifications';

const API_KEY = Meteor.settings.google ? Meteor.settings.google.apiKey : undefined;
const GCM_ENDPOINT = 'https://fcm.googleapis.com/fcm/send';

export const sendNotifications = (ids, notification) => {
  const { type, title, body, icon, actions, room } = notification;

  const users = Meteor.users.find({ _id: { $in: ids } });

  const notifications = users.map((user) => {
    try {
      const subscriptionIds = user.services.gcm.subscriptionIds;
      return {
        type,
        owner: user._id,
        createdAt: new Date(),
        data: {
          actions,
          active: true,
          body,
          icon: icon || APP_ICON,
          title,
          room,
        },
        sent: false,
        subscriptionIds,
        unread: true,
      };
    } catch (e) {
      return [];
    }
  });

  const notificationIds = Notifications.batchInsert(notifications);

  try {
    const result = HTTP.post(GCM_ENDPOINT, {
      headers: {
        Authorization: `key=${API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        registration_ids: _.flatten(_.pluck(notifications, 'subscriptionIds')),
        notification,
      },
    });

    if (result.statusCode === 200) {
      return true;
    }
    throw new Meteor.Error(result.statusCode, 'something went wrong');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    // Got a network error, time-out or HTTP error in the 400 or 500 range.
    throw new Meteor.Error(500, 'something went wrong');
  }
};

export default sendNotifications;
