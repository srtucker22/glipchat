// publish current user
Meteor.publish('user', () => {
  check(arguments, Match.OneOf({}, null, undefined));
  return Meteor.users.find({_id: this.userId});
});

// publish all users
Meteor.publish('users', () => {
  check(arguments, Match.OneOf({}, null, undefined));

  if (Roles.userIsInRole(this.userId, ['manage-users','admin'])) {
    return Meteor.users.find();
  } else {
    this.ready();
  }
});
