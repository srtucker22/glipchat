// Dependencies
var RTCStore = null;
var UserStore = null;

Dependency.autorun(()=> {
  RTCStore = Dependency.get('RTCStore');
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
    Meteor.subscribe('room', _this.currentRoomId.get(), {
      onReady() {
        // set the current room object
        _this.currentRoom.set(Rooms.findOne({_id: _this.currentRoomId.get()}));
        _this.gettingCurrentRoom.set(false);
      },
    });
  });

  // Callbacks
  _.extend(_this, {
    createRoom() {
      _this.creatingRoom.set(true);
      _this.createError.set('');
      UserStore.requireUser().then((user)=> {
        Rooms.insert({
          owner: user._id,
          connected: [user._id],
        }, (err, id)=> {
          _this.creatingRoom.set(false);
          if (err) {
            _this.createError.set(err);
          } else {
            _this.gettingCurrentRoom.set(true);
            _this.currentRoomId.set(id);
          }
        });
      },

      (err)=> {
        _this.creatingRoom.set(false);
        _this.createError.set({status: 403, description: 'UNAUTHORIZED'});
      });
    },

    joinRoom(r) {  // join an existing room
      if (_this.currentRoomId.get() !== r) {
        _this.gettingCurrentRoom.set(true);
        _this.currentRoomId.set(r);
      }
    },

    joinRoomStream(r){
      RTCStore.joinRoomStream(r);
    },

    // Promise for requested room to load
    requireRoom(r) {
      return new Promise((resolve, reject)=> {
        Tracker.autorun(function(c) {
          if (_this.gettingCurrentRoom.get() || !_this.currentRoomId.get())
            return;

          // stop the tracker
          c.stop();

          if (_this.currentRoom.get() && _this.currentRoom.get()._id === r) {
            resolve(_this.currentRoom.get());
          } else {
            reject({status: 404, description: 'ROOM_NOT_FOUND'});
          };
        });
      });
    },
  });

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'CREATE_ROOM':
        _this.createRoom();
        break;
      case 'JOIN_ROOM':
        _this.joinRoom(payload.roomId);
        break;
      case 'JOIN_ROOM_STREAM':
        _this.joinRoomStream(payload.roomId);
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('RoomStore', new RoomStore());
