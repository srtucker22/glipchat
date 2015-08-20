var RTCActions = function() {
  var _this = this;

  _.extend(_this, {
    toggleLocalAudio() {
      Dispatcher.dispatch({ actionType: 'TOGGLE_LOCAL_AUDIO'});
    },

    toggleLocalVideo() {
      Dispatcher.dispatch({ actionType: 'TOGGLE_LOCAL_VIDEO'});
    },

    disconnect(roomId) {
      Dispatcher.dispatch({ actionType: 'DISCONNECT'});
    },

    getLocalStream() {
      Dispatcher.dispatch({ actionType: 'GET_LOCAL_STREAM'});
    },

    stopLocalStream() {
      Dispatcher.dispatch({ actionType: 'STOP_LOCAL_STREAM'});
    },
  });

  return _this;
};

Dependency.add('RTCActions', new RTCActions());
