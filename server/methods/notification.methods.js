import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import * as notificationUtils from '../utils/notification.utils';
import { Notifications } from '../../lib/notifications';

Meteor.methods({
  getNotification(sub) {
    check(sub, {
      subscriptionId: String,
    });

    this.unblock();

    const { subscriptionId } = sub;

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    const notification = Notifications.findOne({
      owner: this.userId,
      subscriptionIds: subscriptionId,
      sent: false,
    });

    // // TODO: get all the notifications for this subscriptionId
    // mark all as sent
    // send a single notification 'you have received 2 notificaitons etc.'
    // Notifications.update({
    //   owner: this.userId,
    //   subscriptionId,
    //   sent: false,
    //   sort: {createdAt: -1},
    // }, {$set: {sent: true}}, {multi: true});

    if (!notification) {
      throw new Meteor.Error(400, 'notification not found');
    }

    Notifications.update(notification._id, { $set: { sent: true } });

    return notification;
  },

  sendNotifications(ids, notification) {
    check(ids, [String]);
    check(notification, {
      actions: Match.Maybe([String]),
      body: Match.Maybe(String),
      data: Match.Maybe(String),
      icon: Match.Maybe(String),
      title: Match.Maybe(String),
    });

    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    return notificationUtils.sendNotifications(ids, notification);
  },

  markAllNotificationsRead(args) {
    this.unblock();

    check(args, Match.Optional({}));

    // only users can update notifications
    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    // update the notifications
    return Notifications.update(
      { owner: this.userId },
      { $set: { unread: false } },
      { multi: true },
    );
  },

  markNotificationRead(id) {
    this.unblock();

    check(id, String);

    // only users can update notifications
    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    // update the notification
    return Notifications.update(
      { _id: id, owner: this.userId },
      { $set: { unread: false } },
    );
  },
});
