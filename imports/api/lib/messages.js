import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles';
import SimpleSchema from 'simpl-schema';
import { MANAGER_ROLES } from './roles';

export const Messages = new Mongo.Collection('messages');

const MessageSchema = new SimpleSchema({
  owner: {
    type: String,
  },
  text: {
    type: String,
  },
  room: {
    type: String,
    optional: true,
  },
  recipients: {
    type: Array,
    optional: true,
  },
  'recipients.$': { type: String },
  createdAt: {
    type: Date,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
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

Messages.attachSchema(MessageSchema);

// restrict modification access to authorized users
Messages.allow({
  insert(userId, message) {
    const hasRoomAccess = !message.room || Roles.userIsInRole(userId, [message.room]);
    return hasRoomAccess && message.owner === userId;
  },

  update(userId, message) {
    const hasRoomAccess = !message.room || Roles.userIsInRole(userId, [message.room]);
    return hasRoomAccess && message.owner === userId;
  },

  remove(userId, message) {
    return message.owner === userId || (Roles.userIsInRole(userId, MANAGER_ROLES));
  },

  fetch: ['owner', 'room'],
});

export default Messages;
