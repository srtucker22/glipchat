var RoomActions = function() {
  var _this = this;

  _.extend(_this, {
    clearInvitees() {
      Dispatcher.dispatch({ actionType: 'CLEAR_INVITEES'});
    },

    createRoom() {
      Dispatcher.dispatch({ actionType: 'CREATE_ROOM'});
    },

    hideInviteModal(){
      Dispatcher.dispatch({
        actionType: 'HIDE_INVITE_MODAL',
      });
    },

    invite(invitees){
      Dispatcher.dispatch({
        actionType: 'INVITE',
        invitees,
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
    },

    updateInvitees(invitees) {
      Dispatcher.dispatch({ actionType: 'UPDATE_INVITEES', invitees });
    },
  });

  return _this;
};

Dependency.add('RoomActions', new RoomActions());
