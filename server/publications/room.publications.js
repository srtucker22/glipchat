import { Roles } from 'meteor/alanning:roles';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Rooms } from '../../lib/rooms';
import { MANAGER_ROLES } from '../../lib/roles';

// publish all rooms
Meteor.publish('rooms', function(opts) { // eslint-disable-line consistent-return
  check(opts, {
    room: Match.Maybe(String),
    available: Match.Maybe(String),
  });
  const self = this;

  if (Roles.userIsInRole(this.userId, MANAGER_ROLES)) {
    return Rooms.find();
  }
  self.autorun(() => {
    const user = Meteor.users.findOne(this.userId);
    if (!user) {
      return self.ready();
    }

      // return all available rooms
    if (opts.available) {
      return Rooms.find({ _id: { $in: user.roles[Roles.GLOBAL_GROUP] } });
    }

      // return current room
    if (opts.room) {
      if (Roles.userIsInRole(self.userId, opts.room)) {
        return Rooms.find(opts.room);
      }
      return self.ready();
    }

    return self.ready();
  });
});
