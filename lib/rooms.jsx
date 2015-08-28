Rooms = new Mongo.Collection('rooms');

var Schema = {};

Schema.Rooms = new SimpleSchema({
  owner: {
    type: String,
  },

  // list of userIds currently connected to room
  connected: {
    type: [String],
    optional: true,
  },
});

Rooms.attachSchema(Schema.Rooms);

// restrict modification access to authorized users
Rooms.allow({
  insert(userId, room) {
    return room.owner === userId  || (Roles.userIsInRole(userId, ['manage-users','admin']));
  },

  update(userId, room, fields, modifier) { // TODO : make this more restrictive based on the fields
    return room.owner === userId || (Roles.userIsInRole(userId, [room._id, 'manage-users','admin']));
  },

  remove(userId, room, fields, modifier) {
    return room.owner === userId  || (Roles.userIsInRole(userId, ['manage-users','admin']));
  },

  fetch: ['owner'],
});
