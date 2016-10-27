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
import {check, Match} from 'meteor/check';
import {MANAGER_ROLES} from '../../lib/roles';
import {Meteor} from 'meteor/meteor';
import {Roles} from 'meteor/alanning:roles';
import deepExtend from 'deep-extend';

// publish current user
Meteor.publish('user', function() {
  check(arguments, Match.OneOf({}, null, undefined));
  return Meteor.users.find(
    {_id: this.userId},
    {fields: {services: 1, history: 1, status: 1}}
  );
});

// publish all users
Meteor.smartPublish('users', function(opts) {
  check(opts, {
    room: Match.Maybe(String), // the current room
    contacts: Match.Maybe([Match.Any]), // include contacts
  });

  const userProjection = {
    fields: {profile: 1, history: 1, status: 1, services: 1},
  };

  if (Roles.userIsInRole(this.userId, MANAGER_ROLES)) {
    return Meteor.users.find({}, userProjection);
  } else {
    let res = [];
    res.push(Meteor.users.find(this.userId, userProjection));

    !!opts.room && res.push(Roles.getUsersInRole(opts.room, Roles.GLOBAL_GROUP, deepExtend({
      fields: {
        'roles.__global_roles__.$': 1,
      },
    }, userProjection)));

    !!opts.contacts && res.push(Meteor.users.find({
        'services.google.email': {$in: _.pluck(contacts, 'email')}
      }, {
        fields: {
          profile: 1,
          status: 1,
        }
      }
    ));

    return res;

    // TODO: we should really restrict which users are visible
    // this.ready()
  }
});

Meteor.publish('contacts', function(contacts) {
  check(arguments, [Match.Any]);

  if (!contacts || !contacts.length) {
    this.ready();
  }

  return Meteor.users.find({
    'services.google.email': {$in: _.pluck(contacts, 'email')}
  }, {
    fields: {
      profile: 1,
      status: 1,
    }
  });
});
