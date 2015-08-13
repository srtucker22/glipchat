var RoomActions = function() {
  var _this = this;

  _.extend(_this, {
    createRoom() {
      Dispatcher.dispatch({ actionType: 'CREATE_ROOM'});
    },

    joinRoom(roomId) {
      Dispatcher.dispatch({
        actionType: 'JOIN_ROOM',
        roomId
      });
    },

    joinRoomStream(roomId) {
      Dispatcher.dispatch({
        actionType: 'JOIN_ROOM_STREAM',
        roomId
      });
    }
  });

  return _this;
};

Dependency.add('RoomActions', new RoomActions());
