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
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { MANAGER_ROLES } from '../../lib/roles';
import { check, Match } from 'meteor/check';

// update a users permissions
Meteor.methods({
  /**
   * update a user's permissions
   *
   * @param {String} targetUserId Id of user to update
   * @param {Array} roles User's new permissions
   * @param {String} group Company to update permissions for
   */
  updateRoles(targetUserId, roles, group) {
    check(targetUserId, String);
    check(roles, [String]);
    check(group, String);

    let loggedInUser = Meteor.user();

    if (!loggedInUser ||
        !Roles.userIsInRole(loggedInUser, ['manage-users','admin'], group)) {
      throw new Meteor.Error(403, 'Access denied');
    }

    Roles.setUserRoles(targetUser, roles, group);
  },

  /**
   * delete a user from a specific group
   *
   * @param {String} targetUserId _id of user to delete
   * @param {String} group Company to update permissions for
   */
  deleteUser(targetUserId, group) {
    check(targetUserId, String);
    check(group, String);

    let loggedInUser = Meteor.user();

    if (!loggedInUser ||
      (!Roles.userIsInRole(loggedInUser, ['manage-users','admin'], group) &&
        Meteor.userId() != targetUserId)) {
      throw new Meteor.Error(403, 'Access denied');
    }

    // remove permissions for target group
    Roles.setUserRoles(targetUserId, [], group);

    // do other actions required when a user is removed...
    return Meteor.users.remove({_id: targetUserId});
  },
});

// don't allow existing low level user to create new users other than themselves
Accounts.validateNewUser((user) => {

  let loggedInUser = this.userId;

  if (!loggedInUser ||
    Roles.userIsInRole(loggedInUser, ['admin','manage-users'])) {
    return true;
  }

  throw new Meteor.Error(403, 'Not authorized to create new users');
});
