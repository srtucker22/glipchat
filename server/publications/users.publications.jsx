// publish current user
Meteor.publish('user', function(){
  check(arguments, Match.OneOf({}, null, undefined));
  return Meteor.users.find({_id: this.userId}, {fields: {services: 1, history: 1}});
});

// publish all users
Meteor.publish('users', function(){
  check(arguments, Match.OneOf({}, null, undefined));

  if (Roles.userIsInRole(this.userId, ['manage-users','admin'])) {
    return Meteor.users.find({}, {fields: {services: 1, history: 1}});
  } else {
    this.ready();
  }
});
