import {MANAGER_ROLES} from './roles';
import {Mongo} from 'meteor/mongo';
import {SimpleSchema} from 'meteor/aldeed:simple-schema';

export const Messages = new Mongo.Collection('messages');

const MessageSchema = new SimpleSchema({
  owner: {
    type: String,
    index: 1,
  },
  text: {
    type: String,
  },
  room: {
    type: String,
    optional: true,
    index: 1,
  },

  recipients: {
    type: [String],
    optional: true,
    index: 1,
  },

  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {$setOnInsert: new Date()};
      } else {
        this.unset();  // Prevent user from supplying their own value
      }
    },
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

Messages.attachSchema(MessageSchema);

// restrict modification access to authorized users
Messages.allow({
  insert(userId, message) {
    const hasRoomAccess = !message.room || Roles.userIsInRole(userId, [message.room]);
    return hasRoomAccess && message.owner === userId;
  },

  update(userId, message, fields, modifier) {
    const hasRoomAccess = !message.room || Roles.userIsInRole(userId, [message.room]);
    return hasRoomAccess && message.owner === userId;
  },

  remove(userId, message, fields, modifier) {
    return message.owner === userId || (Roles.userIsInRole(userId, MANAGER_ROLES));
  },

  fetch: ['owner', 'room'],
});

export default Messages;
