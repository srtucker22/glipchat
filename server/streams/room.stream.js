import { Meteor } from 'meteor/meteor';
import { UserStatus } from 'meteor/mizzao:user-status';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { Rooms } from '../../lib/rooms';
import { Notifications } from '../../lib/notifications';
import { roomStream } from '../../lib/streams';

// room permissions
roomStream.allowRead(function(eventName) {
  return this.userId === eventName;
});

// authenticated users can emit join and msg events
roomStream.allowWrite('join', 'logged');
roomStream.allowWrite('msg', 'logged');

function disconnect(userId, roomId, room) {
  console.log('disconnect', userId, roomId);
  if (!room) {
    room = Rooms.findOne({ _id: roomId });
  }

  // make sure they are still technically in the Room model
  if (room && _.contains(room.connected, userId)) {
    Rooms.update({ _id: roomId }, { $pull: { connected: userId } });

    // tell everyone in the room the peer has disconnected
    _.each(_.without(room.connected, userId), function(currentUserId) {
      roomStream.emit(
        currentUserId,
        { room: roomId, type: 'peer.disconnected', from: userId },
      );
    });
  }

  Notifications.update({
    'data.room': roomId,
    owner: { $nin: _.without(room.connected, userId) },
  },
  { $set: { 'data.active': _.without(room.connected, userId).length > 0 } },
  { multi: true });
}

// join a room
roomStream.on('join', function(roomId) {
  check(roomId, String);
  // eslint-disable-next-line no-console
  console.log('join', roomId, this.userId);
  const self = this;

  // notify everyone in the room that the peer has connected
  const room = Rooms.findOne({ _id: roomId });

  // don't let connected users add connection in different browser or tab
  if (_.contains(room.connected, self.userId)) {
    roomStream.emit(self.userId, {
      room: roomId,
      type: 'error.duplicate',
      error: {
        status: 409,
        description: 'Conflict: user is already connected to this room',
      },
    });
    return;
  }

  _.each(_.without(room.connected, self.userId), (userId) => {
    // eslint-disable-next-line no-console
    console.log('emitting', userId);
    roomStream.emit(
      userId,
      { room: roomId, type: 'peer.connected', from: self.userId },
    );
  });

  Rooms.update({ _id: roomId }, {
    $addToSet: { connected: self.userId },
  });

  Notifications.update({
    owner: { $nin: room.connected },
    'data.room': roomId,
  },
  { $set: { 'data.active': true } },
  { multi: true });

  // mark notification as inactive and read when user joins room
  Notifications.update({
    owner: self.userId,
    'data.room': roomId,
  },
  { $set: { 'data.active': false, unread: false } },
  { multi: true });

  Meteor.users.update(self.userId,
    { $addToSet: { history: { room: roomId, createdAt: new Date() } } },
  );

  // TODO: this isn't working for whatever reason
  // self.connection.onClose = function () {
  //   console.log('onClose');
  //   disconnect(self.userId, roomId);
  // };
});

// alternative connection tracker
// when someone disconnects, remove them from the Room's connected list
UserStatus.events.on('connectionLogout', ({ userId }) => {
  const rooms = Rooms.find({ connected: userId }).fetch();
  if (rooms.length) {
    _.each(rooms, room => disconnect(userId, room._id, room));
  }
});

// send messages between people in the room
roomStream.on('msg', function(data) {
  // check the data for proper values
  check(data, Match.ObjectIncluding({ type: String, room: String }));
  check(data.to, Match.OneOf(null, String, undefined));
  check(_.omit(data, ['type', 'room', 'to']), Match.OneOf(
    {
      sdp: { sdp: String, type: String },
    }, {
      ice: Match.OneOf({
        sdpMLineIndex: Number,
        sdpMid: String,
        candidate: String,
      },
      {},
      null,
    ) }, {
      tracks: {
        audio: Boolean,
        video: Boolean,
      },
    },
    {},
  ));

  const self = this;
  // eslint-disable-next-line no-console
  console.log(`${data.type} received from user ${self.userId}`);

  // user is disconnecting without closing window
  if (data.type === 'disconnect') {
    disconnect(self.userId, data.room);
    return;
  }

  // find the room
  const room = Rooms.findOne({ _id: data.room });
  // eslint-disable-next-line no-console
  console.log(`emitting ${data.type} to ${data.to}`);

  // emit message to recipients
  if (room) {
    data.from = self.userId; // eslint-disable-line no-param-reassign
    if (data.to) {
      // emit message to singular recipient
      if (_.contains(room.connected, data.to)) {  // make sure the user is in the room
        data.from = self.userId; // eslint-disable-line no-param-reassign
        roomStream.emit(data.to, data);
      }
    } else {
      // emit the message to everyone in the room
      _.each(_.without(room.connected, self.userId), function(currentUserId) {
        roomStream.emit(
          currentUserId,
          data,
        );
      });
    }
  }
});
