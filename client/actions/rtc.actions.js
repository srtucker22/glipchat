import { _ } from 'meteor/underscore';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { ICE_CONFIG, GUM_CONSTRAINTS } from '../../lib/config';
import { roomStream } from '../../lib/streams';
import * as constants from '../constants/constants';
import * as dataActions from './data.actions';
import DataChannelStore from '../stores/data-channel.store';
import MediaStore from '../stores/media.store';
import PeerConnectionStore from '../stores/peer-connection.store';
import store from '../stores/store';

export const getLocalStream = () => (dispatch, getState) => {
  const { localStream } = getState().rtc;

  if (!localStream || !localStream.loading) {
    dispatch({
      type: constants.GET_LOCAL_STREAM,
    });

    if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      return dispatch({
        type: constants.LOCAL_STREAM_ERROR,
        error: {
          status: 405,
          description: 'I am sorry, WebRTC is not supported by your browser.',
        },
      });
    }

    return navigator.mediaDevices.getUserMedia(GUM_CONSTRAINTS)
        .then((s) => {
          console.log('received local stream');
          // add the local stream to the MediaStore
          // this store holds MediaStream objects outside of redux
          MediaStore.local = s;
          return dispatch({
            type: constants.SET_LOCAL_STREAM,
          });
        })
        .catch((error) => {
          error.status = error.status || error.name;
          return dispatch({
            type: constants.LOCAL_STREAM_ERROR,
            error,
          });
        });
  }
};

export const joinRoomStream = (room) => {
  roomStream.emit('join', room);
  return {
    type: constants.JOIN_ROOM_STREAM,
    room,
  };
};

export const stopLocalStream = () => {
  if (MediaStore.local) {
    MediaStore.local.getTracks().forEach((track) => {
      track.stop();
    });
    MediaStore.local = null;
  }

  return {
    type: constants.STOP_LOCAL_STREAM,
  };
};

export const leaveRoomStream = room => (dispatch, getState) => {
  if (!room) {
    room = getState().rooms.current;
  }

  roomStream.emit('msg', {
    type: 'disconnect',
    room,
  });

  // clear MediaStore of remote media streams
  Object.keys(PeerConnectionStore).map((key) => {
    clearPeerConnection(key);
  });

  return dispatch({
    type: constants.LEAVE_ROOM_STREAM,
    room,
  });
};

export const toggleTrack = (id, source, type) => {
  if (MediaStore[id]) {
    const track = MediaStore[id][`get${type}Tracks`]()[0];
    track.enabled = !track.enabled;

    if (source == 'local') {
      const action = {
        type: constants.UPDATE_REMOTE_STREAM,
        tracks: {},
      };
      action.tracks[type.toLowerCase()] = track.enabled;
      _.each(DataChannelStore, (channel, key) => {
        dataActions.sendAction(key, action);
      });
    }

    return {
      type: constants[`TOGGLE_${source.toUpperCase()}_${type.toUpperCase()}`],
      enabled: track.enabled,
      id,
    };
  }
};

export const toggleLocalTrack = type => (toggleTrack('local', 'local', type));

export const toggleLocalAudio = () => (toggleLocalTrack('Audio'));

export const toggleLocalVideo = () => (toggleLocalTrack('Video'));

export const toggleRemoteAudio = id => (toggleTrack(id, 'remote', 'Audio'));

// remove all MediaStreams, delete the reference and close RTCPeerConnection
function clearPeerConnection(id) {
  if (PeerConnectionStore[id]) {
    if (MediaStore[id] instanceof MediaStream) {
      PeerConnectionStore[id].removeStream(MediaStore[id]);
      delete MediaStore[id];
    }
    PeerConnectionStore[id].close();
    delete PeerConnectionStore[id];
  }

  store.dispatch({
    type: constants.REMOVE_REMOTE_STREAM,
    id,
  });
}

/**
 * [getPeerConnection description]
 * @param  {String} id   [description]
 * @param  {String} room [description]
 * @return {RTCPeerConnection}      [description]
 */
function getPeerConnection(id, room) {
  if (PeerConnectionStore[id]) {
    return PeerConnectionStore[id];
  }

  const pc = new RTCPeerConnection(ICE_CONFIG);
  PeerConnectionStore[id] = pc;
  pc.addStream(MediaStore.local);  // add the stream

  const tracks = {
    audio: MediaStore.local.getAudioTracks()[0].enabled,
    video: MediaStore.local.getVideoTracks()[0].enabled,
  };

  // Emit local track settings to peer.
  roomStream.emit('msg', {
    type: 'tracks',
    to: id,
    tracks,
    room,
  });

  // establish the RTCDataChannel
  pc.ondatachannel = function({ channel }) {
    DataChannelStore[id] = channel;
    dataActions.setDataChannel(channel, id);
  };

  pc.onicecandidate = (evnt) => {
    const ice = evnt.candidate ? {
      sdpMLineIndex: evnt.candidate.sdpMLineIndex,
      sdpMid: evnt.candidate.sdpMid,
      candidate: evnt.candidate.candidate,
    } : {};
    console.log('Emitting ice candidate', id);
    roomStream.emit('msg', {
      type: 'ice',
      room,
      to: id,
      ice,
    });
  };

  // Successfully added stream.
  pc.onaddstream = (evt) => {
    console.log('Received new stream', id, evt);
    MediaStore[id] = evt.stream;

    store.dispatch({
      type: constants.ADD_REMOTE_STREAM,
      id,
      tracks: {},
    });
  };

  return pc;
}

/**
 * [makeOffer description]
 * @param  {String} id   [description]
 * @param  {String} room [description]
 */
function makeOffer(id, room) {
  const pc = getPeerConnection(id, room);

  // if a data channel doesn't exist, create one
  if (!DataChannelStore[id]) {
    const channel = pc.createDataChannel(id);
    channel.onopen = () => {
      DataChannelStore[id] = channel;
      dataActions.setDataChannel(channel, id);
    };
  }

  pc.createOffer((sessionDescription) => {
    pc.setLocalDescription(sessionDescription, () => {
      console.log('Creating an offer for', id, sessionDescription);
      roomStream.emit('msg', {
        type: 'sdp-offer',
        to: id,
        sdp: {
          type: sessionDescription.type,
          sdp: sessionDescription.sdp,
        },
        room,
      });
    }, (e) => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
  }, (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
  });
}

/**
 * handle all room stream emissions
 * @param  {Object} data [description]
 */
function handleMessage(data) {
  console.log('data', data);
  const pc = getPeerConnection(data.from, data.room);
  if (pc) {
    pc.iceQueue = [];
  }
  switch (data.type) {
    case 'peer.connected':
      console.log('Peer connected', data.from);
      makeOffer(data.from, data.room);
      break;

    case 'peer.disconnected':
      console.log('Peer disconnected', data.from);
      clearPeerConnection(data.from);
      break;

    case 'sdp-offer':
      console.log('received an offer');
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
        console.log('Setting remote description by offer');
        pc.createAnswer((sessionDescription) => {
          pc.setLocalDescription(sessionDescription, function() {
            // successfully set local description
            roomStream.emit('msg', {
              to: data.from,
              room: data.room,
              sdp: {
                type: sessionDescription.type,
                sdp: sessionDescription.sdp,
              },
              type: 'sdp-answer',
            });
          }, (e) => {
            // eslint-disable-next-line no-console
            console.error(e);
          });
        }, (err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
      }, (err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });

      break;

    case 'sdp-answer':
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), () => {
        console.log('Setting remote description by answer');
      }, (e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
      break;

    case 'ice':
      if (data.ice && data.ice.candidate) {
        console.log('Adding ice candidates');
        pc.iceQueue.push(data.ice);
        if (pc.remoteDescription && pc.localDescription) {
          _.each(pc.iceQueue, (candidate) => {
            pc.addIceCandidate(new RTCIceCandidate(data.ice), () => {
              // Successfully added candidate.
            }, (err) => {
              // eslint-disable-next-line no-console
              console.error(err);
            });
          });
        }
      }

      break;

    // When peer changes their own track availibility
    case 'tracks':
      store.dispatch({
        type: constants.UPDATE_REMOTE_STREAM,
        id: data.from,
        tracks: data.tracks,
      });
      break;

    // The server has detected the user is trying to connect twice.
    case 'error.duplicate':
      store.dispatch(stopLocalStream());
      store.dispatch({
        type: constants.LOCAL_STREAM_ERROR,
        error: data.error,
      });
      break;
  }
}

// listen for roomstream events to current userId and stop when logged out
let currentUserId;
Tracker.autorun(() => {
  if (currentUserId) {  // kill old listeners
    roomStream.stop(currentUserId);
  }

  if (Meteor.userId()) { // add new listeners
    currentUserId = Meteor.userId();
    roomStream.on(currentUserId, handleMessage);
  }
});
