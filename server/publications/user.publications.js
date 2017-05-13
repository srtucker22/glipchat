import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import deepExtend from 'deep-extend';
import { MANAGER_ROLES } from '../../lib/roles';

// publish current user
Meteor.publish('user', function(...args) {
  check(args, Match.Maybe({}));
  return Meteor.users.find(
    { _id: this.userId },
    { fields: { profile: 1, services: 1, history: 1, status: 1 } },
  );
});

// publish all users
Meteor.smartPublish('users', function(opts) {
  check(opts, {
    room: Match.Maybe(String), // the current room
    contacts: Match.Maybe([Match.Any]), // include contacts
  });

  const userProjection = {
    fields: { profile: 1, history: 1, status: 1, services: 1 },
  };

  if (Roles.userIsInRole(this.userId, MANAGER_ROLES)) {
    return Meteor.users.find({}, userProjection);
  }
  const res = [];
  res.push(Meteor.users.find(this.userId, userProjection));

  if (opts.room) {
    res.push(Roles.getUsersInRole(opts.room, Roles.GLOBAL_GROUP, deepExtend({
      fields: {
        'roles.__global_roles__.$': 1,
      },
    }, userProjection)));
  }

  if (opts.contacts) {
    res.push(Meteor.users.find({
      'services.google.email': { $in: _.pluck(opts.contacts, 'email') },
    }, {
      fields: {
        profile: 1,
        status: 1,
      },
    }));
  }

  return res;

    // TODO: we should really restrict which users are visible
    // this.ready()
});

Meteor.publish('contacts', function(contacts) {
  check(contacts, Match.Maybe([{ email: Match.Maybe(String) }]));

  if (!contacts || !contacts.length) {
    this.ready();
  }

  return Meteor.users.find({
    'services.google.email': { $in: _.pluck(contacts, 'email') },
  }, {
    fields: {
      profile: 1,
      status: 1,
    },
  });
});
