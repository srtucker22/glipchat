/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Rooms = new Mongo.Collection('rooms');

const RoomSchema = new SimpleSchema({
  owner: {
    type: String,
  },

  // list of userIds currently connected to room
  connected: {
    type: [String],
    optional: true,
  },
});

Rooms.attachSchema(RoomSchema);

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
