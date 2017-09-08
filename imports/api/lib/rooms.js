import { Roles } from 'meteor/alanning:roles';
import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

export const Rooms = new Mongo.Collection('rooms');

const RoomSchema = new SimpleSchema({
  owner: {
    type: String,
  },

  // list of userIds currently connected to room
  connected: {
    type: Array,
    optional: true,
  },
  'connected.$': { type: String },
});

Rooms.attachSchema(RoomSchema);

// restrict modification access to authorized users
Rooms.allow({
  insert(userId, room) {
    return room.owner === userId || (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  update(userId, room) { // TODO : make this more restrictive based on the fields
    return room.owner === userId || (Roles.userIsInRole(userId, [room._id, 'manage-users', 'admin']));
  },

  remove(userId, room) {
    return room.owner === userId || (Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  fetch: ['owner'],
});

export default Rooms;
