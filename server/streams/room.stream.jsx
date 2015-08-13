// room permissions
roomStream.permissions.read(function(eventName) {
  return this.userId == eventName;
});

// join a room
roomStream.on('join', function(roomId) {
  check(roomId, String);
  var _this = this;

  // notify everyone in the room that the peer has connected
  var room = Rooms.findOne({_id: roomId});

  _.each(_.without(room.connected, _this.userId), function(userId) {
    roomStream.emit(userId, {room: roomId, type: 'peer.connected', from: _this.userId});
  });

  Rooms.update({_id: roomId}, {$addToSet: {connected: _this.userId}});

  // when someone disconnects, remove them from the Room's connected list
  _this.onDisconnect = function() {
    var room = Rooms.findOne({_id: roomId});
    if (room && _.contains(room.connected, _this.userId)) {  // make sure they are still technically in the Room model
      Rooms.update({_id: roomId}, {$pull: {connected: _this.userId}});

      // tell everyone in the room the peer has disconnected
      _.each(_.without(room.connected, _this.userId), function(userId) {
        roomStream.emit(userId, {room: roomId, type: 'peer.disconnected', from: _this.userId});
      });
    }
  };
});

// send messages between people in the room
roomStream.on('msg', function(data) {
  // check the data for proper values
  check(data, Match.ObjectIncluding({type: String, room: String}));
  check(data.to, Match.OneOf(null, String, undefined));
  check(_.omit(data, ['type', 'room', 'to']), Match.OneOf(
    {sdp: {sdp: String, type: String}},
    {ice: Match.OneOf({sdpMLineIndex: Number, sdpMid: String, candidate: String}, {}, null)}
  ));

  var _this = this;

  console.log(data.type + ' received from user ' + this.userId);

  // emit the message to everyone in the room
  var room = Rooms.findOne({_id: data.room});
  if (room && _.contains(room.connected, data.to)) {  // make sure the user is in the room

    console.log('emitting ' + data.type + ' to ' + data.to);

    data.from = _this.userId;
    roomStream.emit(data.to, data);
  }
});
