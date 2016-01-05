// publish all rooms
Meteor.publish('rooms', function() {
  check(arguments, Match.OneOf({}, null, undefined));

  var _this = this;

  if (Roles.userIsInRole(this.userId, ['manage-users','admin'])) {
    return Rooms.find();
  } else {
    _this.ready();
  }
});

// publish room by _id
Meteor.publish('room', function(roomId) {
  check(roomId, String);

  var _this = this;

  if (Roles.userIsInRole(this.userId, [roomId, 'manage-users','admin'])) {
    return Rooms.find({_id: roomId});
  } else {
    _this.ready();
  }
});
