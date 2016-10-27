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
import {MANAGER_ROLES} from '../../lib/roles';
import {check, Match} from 'meteor/check';
import {Meteor} from 'meteor/meteor';
import {Rooms} from '../../lib/rooms';

// publish all rooms
Meteor.publish('rooms', function(opts) {
  check(opts, {
    room: Match.Maybe(String),
    available: Match.Maybe(String),
  });
  const _this = this;

  if (Roles.userIsInRole(this.userId, MANAGER_ROLES)) {
    return Rooms.find();
  } else {
    _this.autorun((computation)=> {
      const user = Meteor.users.findOne(this.userId);
      if (!user) {
        return _this.ready();
      }

      // return all available rooms
      if (!!opts.available) {
        return Rooms.find({_id: {$in: user.roles[Roles.GLOBAL_GROUP]}});
      }

      // return current room
      if (!!opts.room) {
        if (Roles.userIsInRole(_this.userId, opts.room)) {
          return Rooms.find(opts.room);
        } else {
          return _this.ready();
        }
      }

      return _this.ready();
    });
  }
});
