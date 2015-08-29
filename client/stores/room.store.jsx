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
  _this.inviteError = ReactiveVar(null);
  _this.invitees = ReactiveVar(null);
  _this.inviteModalVisible = ReactiveVar(false);

  // auto-update the subscription to the room and store the room
  Tracker.autorun(function(c) {
    _this.currentRoom.set(Rooms.findOne({_id: _this.currentRoomId.get()}));
    if(!!_this.currentRoomId.get()){
      Meteor.call('grantRoomAccess', _this.currentRoomId.get(), (err)=> {
        if(!err){
          Meteor.subscribe('room', _this.currentRoomId.get(), {
            onReady() {
              // set the current room object
              _this.gettingCurrentRoom.set(false);
            },
          });
        } else {
          console.error(err);
          _this.gettingCurrentRoom.set(false);
        }
      });
    } else {
      _this.gettingCurrentRoom.set(false);
    }
  });

  // Callbacks
  _.extend(_this, {
    clearInvitees(){
      _this.invitees.set(null);
    },

    createRoom() {
      _this.creatingRoom.set(true);
      _this.createError.set('');
      UserStore.requireUser().then((user)=> {
        Meteor.call('createRoom', (err, id)=> {
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

    hideInviteModal() {
      _this.inviteModalVisible.set(false);
    },

    invite(invitees){
      _this.inviteError.set(null);
      Meteor.call('invite', _this.currentRoomId.get(), invitees, (err, res)=> {
        if (err) {
          _this.inviteError.set(err);
        } else {
          // sent
        }
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

    leaveRoom(){
      _this.currentRoomId.set('');
      _this.inviteModalVisible.set(false);
    },

    // Promise for requested room to load
    requireRoom(r) {
      return new Promise((resolve, reject)=> {
        Tracker.autorun(function(c) {
          if (!!_this.gettingCurrentRoom.get() || !_this.currentRoomId.get())
            return;

          // stop the tracker
          c.stop();

          if (!!_this.currentRoom.get() && _this.currentRoom.get()._id === r) {
            resolve(_this.currentRoom.get());
          } else {
            console.log(_this.gettingCurrentRoom.get());
            reject({status: 404, description: 'ROOM_NOT_FOUND'});
          };
        });
      });
    },

    showInviteModal(){
      if(!!_this.currentRoom.get() && !RTCStore.localStreamError.get() && !!RTCStore.localStream.get())
        _this.inviteModalVisible.set(true);
    },

    updateInvitees(invitees){
      _this.invitees.set(invitees);
    },
  });

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'HIDE_INVITE_MODAL':
        _this.hideInviteModal();
        break;
      case 'CLEAR_INVITEES':
        _this.clearInvitees();
        break;
      case 'CREATE_ROOM':
        _this.createRoom();
        break;
      case 'INVITE':
        _this.invite(payload.invitees);
        break;
      case 'JOIN_ROOM':
        _this.joinRoom(payload.roomId);
        break;
      case 'JOIN_ROOM_STREAM':
        _this.joinRoomStream(payload.roomId);
        break;
      case 'LEAVE_ROOM':
        _this.leaveRoom();
        break;
      case 'SHOW_INVITE_MODAL':
        _this.showInviteModal();
        break;
      case 'UPDATE_INVITEES':
        _this.updateInvitees(payload.invitees);
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('RoomStore', new RoomStore());
