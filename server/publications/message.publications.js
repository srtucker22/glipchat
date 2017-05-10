import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { MANAGER_ROLES } from '../../lib/roles';
import { Messages } from '../../lib/messages';

// publish all messages
Meteor.publish('messages', function(room) {
  check(room, Match.OneOf(null, undefined, String));

  if (Roles.userIsInRole(this.userId, MANAGER_ROLES)) {
    return Messages.find();
  }

  if (!room || !Roles.userIsInRole(this.userId, room)) {
    return this.ready();
  }

  return Messages.find({ room });
});
