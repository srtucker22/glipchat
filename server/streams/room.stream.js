import {Meteor} from 'meteor/meteor';
import {Rooms} from '../../lib/rooms';
import {roomStream} from '../../lib/streams';
import {UserStatus} from 'meteor/mizzao:user-status';
import {_} from 'meteor/underscore';
import {check, Match} from 'meteor/check';

// room permissions
roomStream.allowRead(function(eventName) {
  return this.userId == eventName;
});

// authenticated users can emit join and msg events
roomStream.allowWrite('join', 'logged');
roomStream.allowWrite('msg', 'logged');

function disconnect(userId, roomId) {
  let room = Rooms.findOne({_id: roomId});
  if (room && _.contains(room.connected, userId)) {  // make sure they are still technically in the Room model
    Rooms.update({_id: roomId}, {$pull: {connected: userId}});

    // tell everyone in the room the peer has disconnected
    _.each(_.without(room.connected, userId), function(currentUserId) {
      roomStream.emit(
        currentUserId,
        {room: roomId, type: 'peer.disconnected', from: userId}
      );
    });
  }
}

// join a room
roomStream.on('join', function(roomId) {
  check(roomId, String);
  console.log('join', roomId, this.userId);
  const _this = this;

  // notify everyone in the room that the peer has connected
  const room = Rooms.findOne({_id: roomId});

  // don't let connected users add connection in different browser or tab
  if (_.contains(room.connected, _this.userId)) {
    roomStream.emit(_this.userId, {
      room: roomId,
      type: 'error.duplicate',
      error: {
        status: 409,
        description: 'Conflict: user is already connected to this room',
      },
    });
    return;
  }

  _.each(_.without(room.connected, _this.userId), (userId)=> {
    console.log('emitting', userId);
    roomStream.emit(
      userId,
      {room: roomId, type: 'peer.connected', from: _this.userId}
    );
  });

  Rooms.update({_id: roomId}, {
    $addToSet: {connected: _this.userId},
  });

  Meteor.users.update(_this.userId,
    {$addToSet: {history: {room: roomId, createdAt: new Date}}}
  );

  // TODO: this isn't working for whatever reason
  // _this.connection.onClose = function () {
  //   console.log('onClose');
  //   disconnect(_this.userId, roomId);
  // };

  // alternative connection tracker
  // when someone disconnects, remove them from the Room's connected list
  UserStatus.events.once('connectionLogout', ({userId})=> {
    if (_this.userId == userId) {
      disconnect(_this.userId, roomId);
    }
  });
});

// send messages between people in the room
roomStream.on('msg', function(data) {
  // check the data for proper values
  check(data, Match.ObjectIncluding({type: String, room: String}));
  check(data.to, Match.OneOf(null, String, undefined));
  check(_.omit(data, ['type', 'room', 'to']), Match.OneOf(
    {
      sdp: {sdp: String, type: String},
    }, {
      ice: Match.OneOf({
        sdpMLineIndex: Number,
        sdpMid: String,
        candidate: String,
      },
      {},
      null
    )}, {
      tracks: {
        audio: Boolean,
        video: Boolean,
      },
    },
    {},
  ));

  let _this = this;

  console.log(data.type + ' received from user ' + _this.userId);

  // user is disconnecting without closing window
  if (data.type === 'disconnect') {
    disconnect(_this.userId, data.room);
    return;
  }

  // find the room
  let room = Rooms.findOne({_id: data.room});
  console.log('emitting ' + data.type + ' to ' + data.to);

  // emit message to recipients
  if (room) {
    data.from = _this.userId;
    if (data.to) {
      // emit message to singular recipient
      if (_.contains(room.connected, data.to)) {  // make sure the user is in the room
        data.from = _this.userId;
        roomStream.emit(data.to, data);
      }
    } else {
      // emit the message to everyone in the room
      _.each(_.without(room.connected, _this.userId), function(currentUserId) {
        roomStream.emit(
          currentUserId,
          data
        );
      });
    }
  }
});
