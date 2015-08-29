// the error is the streaming queue -- you need to make sure one thing streams before the other and that you wait to receive ice shit until your local/remote descriptions are set

// Dependencies
var RoomStore = null;
var UserStore = null;

Dependency.autorun(()=> {
  RoomStore = Dependency.get('RoomStore');
  UserStore = Dependency.get('UserStore');
});

// RTCStore Creator
var RTCStore = function() {
  var _this = this;

  var iceConfig = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }]};

  // private vars for peer connections
  var peerConnections = {};
  var peers = {};

  _this.gettingLocalStream = ReactiveVar(false);
  _this.isAudioEnabled = {};
  _this.isLocalAudioEnabled = ReactiveVar(false);
  _this.isLocalVideoEnabled = ReactiveVar(false);
  _this.localStream = ReactiveVar(null);
  _this.localStreamError = ReactiveVar(null);
  _this.peers = ReactiveVar(peers);
  _this.primaryStream = ReactiveVar(null);
  _this.streamError = ReactiveVar(null);

  // get peer connections, add the local stream to the connection, and wait for onaddstream
  function getPeerConnection(id) {
    if (peerConnections[id]) {
      return peerConnections[id];
    }

    var pc = new RTCPeerConnection(iceConfig);
    peerConnections[id] = pc;
    pc.addStream(_this.localStream.get());
    pc.onicecandidate = (evnt)=> {
      var ice = evnt.candidate ? {sdpMLineIndex: evnt.candidate.sdpMLineIndex, sdpMid: evnt.candidate.sdpMid, candidate: evnt.candidate.candidate} : {};
      console.log('Emitting ice candidate', id);
      roomStream.emit('msg', {type: 'ice', room: RoomStore.currentRoomId.get(), to: id, ice: ice});
    };

    pc.onaddstream = (evnt)=> {
      console.log('Received new stream', id);
      peers[id] = evnt.stream;
      _this.peers.set(peers);

      // create a reactive var for the audio
      _this.isAudioEnabled[id] = ReactiveVar(evnt.stream.getAudioTracks()[0].enabled);

      // set the primaryStream to the newest peer
      _this.primaryStream.set(id);
    };

    pc.onremovestream = (evnt)=> {
      console.log('Removing stream', id);
    };

    return pc;
  }

  // make an offer to a peer to connect
  function makeOffer(id) {
    var pc = getPeerConnection(id);
    pc.createOffer((sdp)=> {
      pc.setLocalDescription(sdp, ()=> {
        console.log('Creating an offer for', id);
        roomStream.emit('msg', {type: 'sdp-offer', to: id, sdp: {type: sdp.type, sdp: sdp.sdp}, room: RoomStore.currentRoomId.get()});
      }, (e)=> {
        console.error(e);
      });
    }, (e)=> {
      console.error(e);
    }, { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true }});
  }

  // handle all room stream emissions
  function handleMessage(data) {
    var pc = getPeerConnection(data.from);
    pc.iceQueue = [];
    switch (data.type) {
      case 'peer.connected':
        console.log('Peer connected', data.from);
        makeOffer(data.from);
        break;

      case 'peer.disconnected':
        console.log('Peer disconnected', data.from);
        try {
          pc.removeStream(peers[data.from]);
        } catch(e) {
          console.log(e);
          // Firefox doesn't implement removeStream
          // console.log(e);
        }

        delete peers[data.from];
        _this.peers.set(peers);

        // delete the audioEnabled ReactiveVar
        delete _this.isAudioEnabled[data.from];

        peerConnections[data.from].close();
        delete peerConnections[data.from];

        // if the deleted stream was the primaryStream, set it to the last peer or the localStream
        if(_this.primaryStream.get() === data.from){
          _.keys(peers).length ? _this.primaryStream.set(_.last(_.keys(peers))) : _this.primaryStream.set('local');
        }
        break;

      case 'sdp-offer':
        console.log('received an offer');
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp), ()=> {
          console.log('Setting remote description by offer');
          pc.createAnswer((sdp)=> {
            pc.setLocalDescription(sdp, function() {
              // successfully set local description
            }, function(e) {
              console.error(e);
            });

            roomStream.emit('msg', { to: data.from, room: RoomStore.currentRoomId.get(), sdp: {type: sdp.type, sdp: sdp.sdp}, type: 'sdp-answer' });
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
          _this.streamError.set(e);
          console.error(e);
        });

        break;

      case 'ice':
        if (data.ice && data.ice.candidate) {
          console.log('Adding ice candidates');
          pc.iceQueue.push(data.ice);
          if(pc.remoteDescription && pc.localDescription){
            _.each(pc.iceQueue, (candidate)=> {
              pc.addIceCandidate(new RTCIceCandidate(data.ice), ()=> {
                // successfully added candidate
                //console.log('successfully added candidate');
              }, (err)=> {
                console.error(err);
              });
            });
          }
        }

        break;

      // the server has detected the user is trying to connect twice
      case 'error.duplicate':
        _this.localStreamError.set(data.error);
        _this.stopLocalStream();
        break;
    }
  }

  // disconnect from a room stream, clear all peer data
  _this.disconnect = ()=> {
    console.log('disconnecting');

    // announce disconnect to peers
    roomStream.emit('msg', {
      type: 'disconnect',
      room: RoomStore.currentRoomId.get()
    });

    // clear listener for room messages
    roomStream.removeListener(UserStore.user()._id, handleMessage);

    // clear all peer data
    _.each(peerConnections, (val, key)=>{
      var pc = getPeerConnection(key);
      if(pc.iceConnectionState !== 'closed')
        pc.close();
    });

    peers = {};
    peerConnections = {};
    _this.peers.set(peers);
    _this.primaryStream.set(null);
  }

  // get the local stream from legit browsers
  _this.getLocalStream = ()=> {
    _this.localStreamError.set(null);
    if (!_this.localStream.get() && !_this.gettingLocalStream.get()) {
      _this.gettingLocalStream.set(true);
      if (!window.RTCPeerConnection || !navigator.getUserMedia) {
        _this.localStreamError.set({status: 405, description: 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.'});
        _this.gettingLocalStream.set(false);
        return;
      }

      navigator.getUserMedia({
        video: true,
        audio: true
      }, (s)=> {
        console.log('Getting local stream');
        _this.localStream.set(s);
        _this.gettingLocalStream.set(false);
        _this.primaryStream.set('local');

        _this.isLocalAudioEnabled.set(s.getAudioTracks()[0].enabled);
        _this.isLocalVideoEnabled.set(s.getVideoTracks()[0].enabled);
      }, (e)=> {
        console.error(e);
        _this.localStreamError.set({status: e.name, description: (e.message ? e.message: e.name)});
        _this.gettingLocalStream.set(false);
      });
    } else {
      _this.gettingLocalStream.set(false);
    }
  };

  // make sure the user isn't connected on multiple tabs or browsers
  _this.isDuplicateConnection = ()=> {
    let room = RoomStore.currentRoom.get();
    let val = room && _.contains(room.connected, UserStore.user()._id);
    if(val){
      _this.localStreamError.set({
        status: 409,
        description: 'Conflict: user is already connected to this room'
      });
    }
    return val;
  }

  // join the room stream and announce to peers to start connection process
  _this.joinRoomStream = (r)=> {
    _this.requireLocalStream().then(()=> {
      if(!_this.isDuplicateConnection()){
        console.log('joining room stream');
        roomStream.emit('join', r);

        // handle messages for the current user
        // this might lead to multiple handling when you switch users. make sure to clear on logout
        // maybe belongs in userstore
        roomStream.on(UserStore.user()._id, handleMessage);
      } else {
        _this.stopLocalStream();
      }
    }, (err)=> {
      _this.localStreamError.set(err);
    });
  };

  _this.setPrimaryStream = (id)=> {
    _this.primaryStream.set(id);
  };

  _this.toggleAudio = (id)=> {
    if(_.has(_this.peers.get(), id)){
      _this.peers.get()[id].getAudioTracks()[0].enabled = !_this.peers.get()[id].getAudioTracks()[0].enabled;
      _this.isAudioEnabled[id].set(_this.peers.get()[id].getAudioTracks()[0].enabled);
    }
  };

  _this.toggleLocalAudio = ()=> {
    if(_this.localStream.get()){
      _this.localStream.get().getAudioTracks()[0].enabled = !_this.localStream.get().getAudioTracks()[0].enabled;

      _this.isLocalAudioEnabled.set(_this.localStream.get().getAudioTracks()[0].enabled);
    }
  };

  _this.toggleLocalVideo = ()=> {
    if(_this.localStream.get()){
      _this.localStream.get().getVideoTracks()[0].enabled = !_this.localStream.get().getVideoTracks()[0].enabled;

      _this.isLocalVideoEnabled.set(_this.localStream.get().getVideoTracks()[0].enabled);
    }
  };

  // stop the local stream
  _this.stopLocalStream = ()=> {
    if (!!_this.localStream.get()) {
      _this.localStream.get().stop();
      _this.localStream.set(null);

      if(_this.primaryStream.get() === 'local')
        this.primaryStream.set(null);
    }
  };

  // returns a promise that resolves when the local stream is ready
  _this.requireLocalStream = ()=> {
    return new Promise((resolve, reject)=> {
      Tracker.autorun(function(c) {
        if (_this.gettingLocalStream.get())
          return;

        // stop the tracker
        c.stop();

        if(_this.localStream.get()){
          resolve(_this.localStream.get());
        } else {
          reject(_this.localStreamError.get());
        }
      });
    });
  };

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'DISCONNECT':
        _this.disconnect();
        break;
      case 'GET_LOCAL_STREAM':
        _this.getLocalStream();
        break;
      case 'SET_PRIMARY_STREAM':
        _this.setPrimaryStream(payload.id);
        break;
      case 'STOP_LOCAL_STREAM':
        _this.stopLocalStream();
        break;
      case 'TOGGLE_AUDIO':
        _this.toggleAudio(payload.id);
        break;
      case 'TOGGLE_VIDEO':
        _this.toggleVideo(payload.id);
        break;
      case 'TOGGLE_LOCAL_AUDIO':
        _this.toggleLocalAudio();
        break;
      case 'TOGGLE_LOCAL_VIDEO':
        _this.toggleLocalVideo();
        break;
    }
  });

  return _this;
};

// Create the instance
Dependency.add('RTCStore', new RTCStore());
