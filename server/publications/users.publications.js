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

// publish current user
Meteor.publish('user', function() {
  check(arguments, Match.OneOf({}, null, undefined));
  return Meteor.users.find(
    {_id: this.userId},
    {fields: {services: 1, history: 1, status: 1}}
  );
});

// publish all users
Meteor.publish('users', function() {
  check(arguments, Match.OneOf({}, null, undefined));

  if (Roles.userIsInRole(this.userId, ['manage-users','admin'])) {
    return Meteor.users.find(
      {},
      {fields: {services: 1, history: 1, status: 1}}
    );
  } else {
    this.ready();
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
      status: 1
    }
  });
});
