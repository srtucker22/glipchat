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
  var peerConnections = {};
  var peers = {};

  _this.gettingLocalStream = ReactiveVar(false);
  _this.localStream = ReactiveVar(null);
  _this.localStreamError = ReactiveVar('');
  _this.streamError = ReactiveVar('');
  _this.peers = ReactiveVar(peers);

  function getPeerConnection(id) {
    if (peerConnections[id]) {
      return peerConnections[id];
    }

    var pc = new RTCPeerConnection(iceConfig);
    peerConnections[id] = pc;
    pc.addStream(_this.localStream.get());
    pc.onicecandidate = (evnt)=> {
      var ice = evnt.candidate ? {sdpMLineIndex: evnt.candidate.sdpMLineIndex, sdpMid: evnt.candidate.sdpMid, candidate: evnt.candidate.candidate} : {};
      roomStream.emit('msg', {type: 'ice', room: RoomStore.currentRoomId.get(), to: id, ice: ice});
    };

    pc.onaddstream = (evnt)=> {
      console.log('Received new stream', id);
      peers[id] = evnt.stream;
      _this.peers.set(peers);
    };

    return pc;
  }

  function makeOffer(id) {
    var pc = getPeerConnection(id);
    pc.createOffer((sdp)=> {
      pc.setLocalDescription(sdp, function() {
        console.log('Creating an offer for', id);
        roomStream.emit('msg', {type: 'sdp-offer', to: id, sdp: {type: sdp.type, sdp: sdp.sdp}, room: RoomStore.currentRoomId.get()});
      }, (e)=> {
        console.error(e);
      });
    }, (e)=> {
      console.error(e);
    }, { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true }});
  }

  // handle all roomStream emissions
  function handleMessage(data) {
    var pc = getPeerConnection(data.from);
    switch (data.type) {
      case 'peer.connected':
        console.log('Peer connected', data.from);
        makeOffer(data.from);
        break;
      case 'peer.disconnected':
        console.log('Peer disconnected', data.from);
        peerConnections[data.from].close();
        peerConnections[data.from] = null;

        delete peers[data.from];
        _this.peers.set(peers);
        break;
      case 'sdp-offer':
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

        });

        break;
      case 'sdp-answer':
        pc.setRemoteDescription(new RTCSessionDescription(data.sdp), ()=> {
          console.log('Setting remote description by answer');
        },

        (e)=> {
          console.error(e);
        });

        break;
      case 'ice':
        if (data.ice && data.ice.candidate) {
          console.log('Adding ice candidates');
          pc.addIceCandidate(new RTCIceCandidate(data.ice), ()=> {
            // successfully added candidate
            console.log('successfully added candidate');
          },

          (err)=> {
            console.error(err);
          });
        }

        break;
    }
  }

  _this.getLocalStream = ()=> {
    _this.localStreamError.set('');
    if (!_this.localStream.get() && !_this.gettingLocalStream.get()) {
      _this.gettingLocalStream.set(true);
      if (!window.RTCPeerConnection || !navigator.getUserMedia) {
        _this.localStreamError = {status: 405, description: 'WebRTC is not supported by your browser. You can try the app with Chrome and Firefox.'};
        _this.gettingLocalStream.set(false);
        return;
      }

      navigator.getUserMedia({
        video: true,
        audio: true
      }, (s)=> {
        _this.localStream.set(s);
        _this.gettingLocalStream.set(false);
      }, (e)=> {
        _this.localStreamError.set({status: e.name, description: (e.message ? e.message: e.name)});
        _this.gettingLocalStream.set(false);
      });
    } else {
      _this.gettingLocalStream.set(false);
    }
  };

  _this.joinRoomStream = (r)=> {
    _this.requireLocalStream().then(()=> {
      roomStream.emit('join', r);

      // handle messages for the current user
      // this might lead to multiple handling when you switch users. make sure to clear on logout
      // maybe belongs in userstore
      roomStream.on(UserStore.user()._id, (data)=> {
        handleMessage(data);
      });
    }, (err)=> {
      _this.streamError.set(err);
    });
  }
  _this.stopLocalStream = ()=> {
    !!_this.localStream.get() && _this.localStream.get().stop();
  }

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
  }

  _this.tokenId = Dispatcher.register((payload)=> {
    switch (payload.actionType){
      case 'GET_LOCAL_STREAM':
        _this.getLocalStream();
        break;
      case 'STOP_LOCAL_STREAM':
        _this.stopLocalStream();
    }
  });

  return _this;
};

// Create the instance
Dependency.add('RTCStore', new RTCStore());
