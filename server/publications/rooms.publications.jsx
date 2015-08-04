// publish all rooms
Meteor.publish('rooms', () => {
  check(arguments, Match.OneOf({}, null, undefined));

  if (Roles.userIsInRole(this.userId, ['manage-users','admin'])) {
    return Rooms.find();
  } else {
    this.ready();
  }
});

// publish room by _id
Meteor.publish('room', (roomId) => {
  check(roomId, String);

  if (Roles.userIsInRole(this.userId, [roomId, 'manage-users','admin'])) {
    return Rooms.find({_id: roomId});
  } else {
    this.ready();
  }
});
