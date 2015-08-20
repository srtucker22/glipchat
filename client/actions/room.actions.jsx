var RoomActions = function() {
  var _this = this;

  _.extend(_this, {

    createRoom() {
      Dispatcher.dispatch({ actionType: 'CREATE_ROOM'});
    },

    hideInviteModal(){
      Dispatcher.dispatch({
        actionType: 'HIDE_INVITE_MODAL',
      });
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
    },

    leaveRoom(){
      Dispatcher.dispatch({
        actionType: 'LEAVE_ROOM',
      });
    },

    showInviteModal(){
      Dispatcher.dispatch({
        actionType: 'SHOW_INVITE_MODAL',
      });
    }
  });

  return _this;
};

Dependency.add('RoomActions', new RoomActions());
