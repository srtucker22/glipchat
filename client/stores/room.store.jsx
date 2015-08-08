// Dependencies
var UserStore = null;

Dependency.autorun(()=> {
  UserStore = Dependency.get('UserStore');
});

// RoomStore Creator
var RoomStore = function() {
  var _this = this;
  _this.createError = ReactiveVar('');
  _this.creatingRoom = ReactiveVar(false);
  _this.currentRoom = ReactiveVar(null);
  _this.currentRoomId = ReactiveVar('');
  _this.gettingCurrentRoom = ReactiveVar(false);

  // auto-update the subscription to the room and store the room
  Tracker.autorun(function(c) {
    _this.gettingCurrentRoom.set(true);
    Meteor.subscribe('room', _this.currentRoomId.get(), {
      onReady() {
        _this.currentRoom.set(Rooms.findOne({_id: _this.currentRoomId.get()}));
        _this.gettingCurrentRoom.set(false);
      },
    });
  });

  // Callbacks
  _this.on = {
    createRoom() {
      _this.creatingRoom.set(true);
      _this.createError.set('');
      if (UserStore.user()) {
        Rooms.insert({ owner: UserStore.user()._id }, (err, id)=> {
          _this.creatingRoom.set(false);
          if (err) {
            _this.createError.set(err);
          } else {
            _this.currentRoomId.set(id);
          }
        });
      } else {
        _this.createError.set({status: 403, description: 'UNAUTHORIZED'});
      }
    },

    enterRoom(roomId) {
      _this.enterError.set('');
      _this.currentRoomId.set(roomId);
    },
  };

  _this.requireRoom = (roomId)=> {
    return new Promise((resolve, reject)=> {
      Tracker.autorun(function(c) {
        if (_this.gettingCurrentRoom.get())
          return;

        // stop the tracker
        c.stop();

        if (_this.currentRoom.get() && _this.currentRoom.get()._id === roomId) {
          resolve(_this.currentRoom.get());
        } else {
          reject({status: 404, description: 'ROOM_NOT_FOUND'});
        };
      });
    });
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
