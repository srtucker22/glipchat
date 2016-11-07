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
