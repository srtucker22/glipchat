import { Roles } from 'meteor/alanning:roles';
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Notifications = new Mongo.Collection('notifications');

const NotificationDataSchema = new SimpleSchema({
  title: {
    type: String,
  },
  active: {
    type: Boolean,
    optional: true,
  },
  body: {
    type: String,
  },
  icon: {
    type: String,
    optional: true,
  },
  actions: {
    type: [String],
    optional: true,
  },
  room: {
    type: String,
    optional: true,
  },
});

const NotificationSchema = new SimpleSchema({
  owner: {
    type: String,
  },
  type: {
    type: String,
  },
  subscriptionIds: {
    type: [String],
  },
  sent: {
    type: Boolean,
    autoValue() {
      if (this.isInsert) {
        return false;
      } else if (this.isUpsert) {
        return { $setOnInsert: false };
      }
    },
  },
  unread: {
    type: Boolean,
    autoValue() {
      if (this.isInsert) {
        return true;
      } else if (this.isUpsert) {
        return { $setOnInsert: true };
      }
    },
  },
  data: {
    type: NotificationDataSchema,
    optional: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    autoValue() {
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
  insert(userId) {
    return (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  update(userId, notification) { // TODO : make this more restrictive based on the fields
    return notification.owner === userId || (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  remove(userId, notification) {
    return notification.owner === userId || (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  fetch: ['owner'],
});

export default Notifications;
