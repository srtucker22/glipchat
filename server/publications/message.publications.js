import { check, Match } from 'meteor/check';
import { MANAGER_ROLES } from '../../lib/roles';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Messages } from '../../lib/messages';

// publish all messages
Meteor.publish('messages', function(room) {
  check(room, Match.OneOf(null, undefined, String));
  const _this = this;

  if (Roles.userIsInRole(this.userId, MANAGER_ROLES)) {
    return Messages.find();
  } else {
    if (!room || !Roles.userIsInRole(this.userId, room)) {
      return _this.ready();
    }

    return Messages.find({room});
  }
});
