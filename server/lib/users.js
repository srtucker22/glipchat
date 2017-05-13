import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

const Schema = {};

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String,
    label: 'name',
    optional: true,
  },
  birthday: {
    type: Date,
    optional: true,
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true,
  },
  organization: {
    type: String,
    regEx: /^[a-z0-9A-z . -]{3,30}$/,
    optional: true,
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  bio: {
    type: String,
    optional: true,
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },

    denyInsert: true,
    optional: true,
  },
});

Schema.User = new SimpleSchema({
  username: {
    type: String,
    optional: true,
  },
  emails: {
    type: [Object],

    // this must be optional if you also use other login services like facebook,
    // but if you use only accounts-password, then it can be required
    optional: true,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  createdAt: {
    type: Date,
  },
  profile: {
    type: Schema.UserProfile,
    optional: true,
  },
  history: {
    type: [Object],
    optional: true,
  },
  'history.$.room': {
    type: String,
    optional: true,
  },
  'history.$.createdAt': {
    type: Date,
    optional: true,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  status: {
    type: Object,
    blackbox: true,
    optional: true,
  },

  // Add `roles` to your schema if you use the meteor-roles package.
  // Note that when using this package, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Roles.addUsersToRoles(userId, ["admin"], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
  },
});

// this is killing server performance
// see https://github.com/aldeed/meteor-collection2/issues/338
// Meteor.users.attachSchema(Schema.User);

Meteor.users.allow({
  insert(userId, user) {
    return (userId === user._id ||
      Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  remove(userId, user) {
    return (userId === user._id ||
      Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },

  update(userId, user) {
    return (userId === user._id ||
      Roles.userIsInRole(userId, ['manage-users', 'admin']));
  },
});

// modify user document on creation
Accounts.onCreateUser((options, user) => {
    // create gcm service in user doc
  user.services.gcm = {
    subscriptionIds: [],
  };
  return user;
});
