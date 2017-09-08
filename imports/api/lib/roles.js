import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';

export const ADMIN = 'admin';
export const MANAGE_USERS = 'manage-users';
export const MANAGER_ROLES = [ADMIN, MANAGE_USERS];

if (Meteor.isServer) {
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

      const loggedInUser = Meteor.user();

      if (!loggedInUser ||
          !Roles.userIsInRole(loggedInUser, MANAGER_ROLES, group)) {
        throw new Meteor.Error(403, 'Access denied');
      }

      Roles.setUserRoles(loggedInUser, roles, group);
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

      const loggedInUser = Meteor.user();

      if (!loggedInUser ||
        (!Roles.userIsInRole(loggedInUser, MANAGER_ROLES, group) &&
          Meteor.userId() !== targetUserId)) {
        throw new Meteor.Error(403, 'Access denied');
      }

      // remove permissions for target group
      Roles.setUserRoles(targetUserId, [], group);

      // do other actions required when a user is removed...
      return Meteor.users.remove({ _id: targetUserId });
    },
  });

  // don't allow existing low level user to create new users other than themselves
  Accounts.validateNewUser(() => {
    const loggedInUser = this.userId;

    if (!loggedInUser ||
      Roles.userIsInRole(loggedInUser, MANAGER_ROLES)) {
      return true;
    }

    throw new Meteor.Error(403, 'Not authorized to create new users');
  });
}
