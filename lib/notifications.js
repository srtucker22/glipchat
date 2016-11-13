import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const Notifications = new Mongo.Collection('notifications');

const NotificationSchema = new SimpleSchema({
  owner: {
    type: String,
  },
  subscriptionId: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
  icon: {
    type: String,
    optional: true
  },
  tag: {
    type: String,
    optional: true
  },
  sent: {
    type: Boolean,
    autoValue: function() {
      if (this.isInsert) {
        return false;
      } else if (this.isUpsert) {
        return {$setOnInsert: false};
      }
    }
  },
  data: {
    type: String,
    optional: true,
  },
  actions: {
    type: [String],
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },

    denyInsert: true,
    optional: true,
  },
});

Notifications.attachSchema(NotificationSchema);

// restrict modification access to authorized users
Notifications.allow({
  insert(userId, notification) {
    return (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  update(userId, notification, fields, modifier) { // TODO : make this more restrictive based on the fields
    return notification.owner === userId || (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  remove(userId, notification, fields, modifier) {
    return notification.owner === userId || (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  fetch: ['owner'],
});

export default Notifications;
