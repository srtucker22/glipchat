// RoomStore Creator
var RoomStore = function() {
  var _this = this;
  _this.currentRoomId = ReactiveVar('');
  _this.currentRoom = ReactiveVar(null);

  Tracker.autorun(function(c) {
    Meteor.subscribe('room', _this.currentRoomId.get(), {
      onReady() {
        _this.currentRoom.set(Rooms.findOne({_id: _this.currentRoomId.get()}));
        if (_this.currentRoom.get()) {
          Dispatcher.dispatch({
            actionType: 'GOTO_ROOM',
            params: _this.currentRoom.get(),
          });
        } else if (_this.currentRoomId.get()) {
          Dispatcher.dispatch({
            actionType: 'GOTO_NOT_FOUND',
            params: _this.currentRoom.get(),
          });
        }
      },
    });
  });

  // Callbacks
  _this.on = {
    createRoom() {
      console.log('creating room');
    },

    enterRoom(roomId) {
      _this.currentRoomId.set(roomId);
    },
  };

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'CREATE_ROOM':
        _this.on.createRoom();
        break;
      case 'ENTER_ROOM':
        _this.on.enterRoom(payload.roomId);
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('RoomStore', new RoomStore());
