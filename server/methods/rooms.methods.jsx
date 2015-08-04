// this is mildly insecure -- if you know a roomId, you can sneak in
// we can make rooms more private in the future by requiring auth types and tracking invites, but this can get tricky if we add more than 1 auth type, like email and google account

// room access server methods
Meteor.methods({
  // give user access to a room upon request
  grantRoomAccess(roomId) {
    check(roomId, String);

    let currentRoom = Rooms.findOne(roomId);
    if (!currentRoom) {
      throw new Meteor.Error(400, 'Room not found');
    }

    if (!Roles.userIsInRole(this.userId, roomId)) {
      Roles.addUsersToRoles(this.userId, roomId, Roles.GLOBAL_GROUP);
    }
  },
});
