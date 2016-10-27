/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
import {ICE_CONFIG} from '../../lib/config';
import {roomStream} from '../../lib/streams';
import PeerConnectionStore from '../stores/peer-connection.store';
import MediaStore from '../stores/media.store';
import {Meteor} from 'meteor/meteor';
import * as constants from '../constants/constants';
import store from '../stores/store';
import DataChannelStore from '../stores/data-channel.store';
import * as dataActions from './data.actions';

const GUM_INTERVAL = 2000;  // Interval between getUserMedia

// consistent constraints for getUserMedia
// we can modify these later for fancier things
const GUM_CONSTRAINTS = {
  video: true,
  audio: {
    googEchoCancellation: true,
    echoCancellation: true,
  }
};

export const getLocalStream = ()=> {
  return (dispatch, getState)=> {
    const {localStream} = getState().rtc;

    if (!localStream || !localStream.loading) {
      dispatch({
        type: constants.GET_LOCAL_STREAM,
      });

      if (!window.RTCPeerConnection || !navigator.getUserMedia) {
        return dispatch({
          type: constants.LOCAL_STREAM_ERROR,
          error: {
            status: 405,
            description: 'I am sorry, WebRTC is not supported by your browser.'
          },
        });
      }

      function getUserMedia(constraints = GUM_CONSTRAINTS) {
        navigator.mediaDevices.getUserMedia(constraints)
          .then((s)=> {
            console.log('received local stream');
            MediaStore.local = s; // add the local stream to the MediaStore -- this store holds MediaStream objects outside of redux
            dispatch({
              type: constants.SET_LOCAL_STREAM
            });
          })
          .catch((error)=> {
            error.status = error.status || error.name;
            dispatch({
              type: constants.LOCAL_STREAM_ERROR,
              error,
            });
          });
      }

      getUserMedia(); // get the local stream
    }
  };
};

export const joinRoomStream = (room)=> {
  roomStream.emit('join', room);
  return {
    type: constants.JOIN_ROOM_STREAM,
    room,
  };
};

export const stopLocalStream = ()=> {
  if (!!MediaStore.local) {
    MediaStore.local.getTracks().forEach((track)=> {
      track.stop();
    });
    MediaStore.local = null;
  }

  return {
    type: constants.STOP_LOCAL_STREAM,
  };
};

export const toggleTrack = (id, source, type)=> {
  if (!!MediaStore[id]) {
    const track = MediaStore[id][`get${type}Tracks`]()[0];
    track.enabled = !track.enabled;

    if(source == 'local'){
      const action = {
        type: constants.UPDATE_REMOTE_STREAM,
        tracks: {}
      };
      action.tracks[type.toLowerCase()] = track.enabled;
      _.each(DataChannelStore, (channel, key)=> {
        dataActions.sendAction(key, action);
      })
    }

    return {
      type: constants[`TOGGLE_${source.toUpperCase()}_${type.toUpperCase()}`],
      enabled: track.enabled,
      id,
    };
  }
}

export const toggleLocalTrack = (type)=> (toggleTrack('local', 'local', type));

export const toggleLocalAudio = ()=> (toggleLocalTrack('Audio'));

export const toggleLocalVideo = ()=> (toggleLocalTrack('Video'));

export const toggleRemoteAudio = (id)=> (toggleTrack(id, 'remote', 'Audio'));

function getPeerConnection(id, room) {
  if (!!PeerConnectionStore[id]) {
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
  pc.ondatachannel = function ({ channel }) {
    DataChannelStore[id] = channel;
    dataActions.setDataChannel(channel, id);
  };

  pc.onicecandidate = (evnt)=> {
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
  pc.onaddstream = (evt)=> {
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

function makeOffer(id, room) {
  const pc = getPeerConnection(id, room);

  // if a data channel doesn't exist, create one
  if (!DataChannelStore[id]) {
    const channel = pc.createDataChannel(id);
    channel.onopen = ()=> {
      DataChannelStore[id] = channel;
      dataActions.setDataChannel(channel, id);
    };
  }

  pc.createOffer((sessionDescription)=> {
    pc.setLocalDescription(sessionDescription, ()=> {
      console.log('Creating an offer for', id, sessionDescription);
      roomStream.emit('msg', {
        type: 'sdp-offer',
        to: id,
        sdp: {
          type: sessionDescription.type,
          sdp: sessionDescription.sdp
        },
        room,
      });
    }, (e)=> {
      console.error(e);
    });
  }, (e)=> {
    console.error(e);
  });
}

// Handle all room stream emissions
function handleMessage(data) {
  console.log('data', data);
  const pc = getPeerConnection(data.from, data.room);
  if (!!pc) {
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
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), ()=> {
        console.log('Setting remote description by offer');
        pc.createAnswer((sessionDescription)=> {
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
          }, (e)=> {
            console.error(e);
          });
        }, (err)=> {
          console.error(err);
        });

      }, (err)=> {
        console.error(err);
      });

      break;

    case 'sdp-answer':
      pc.setRemoteDescription(new RTCSessionDescription(data.sdp), ()=> {
        console.log('Setting remote description by answer');
      }, (e)=> {
        console.error(e);
      });
      break;

    case 'ice':
      if (data.ice && data.ice.candidate) {
        console.log('Adding ice candidates');
        pc.iceQueue.push(data.ice);
        if (pc.remoteDescription && pc.localDescription) {
          _.each(pc.iceQueue, (candidate)=> {
            pc.addIceCandidate(new RTCIceCandidate(data.ice), ()=> {
              // Successfully added candidate.
            }, (err)=> {
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
Tracker.autorun(()=> {
  if (!!currentUserId) {  // kill old listeners
    roomStream.stop(currentUserId);
  }

  if (!!Meteor.userId()) { // add new listeners
    currentUserId = Meteor.userId();
    roomStream.on(currentUserId, handleMessage);
  }
});
