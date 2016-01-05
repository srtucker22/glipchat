var RTCActions = function() {
  return {
    disconnect(roomId) {
      Dispatcher.dispatch({actionType: 'DISCONNECT'});
    },

    getLocalStream() {
      Dispatcher.dispatch({actionType: 'GET_LOCAL_STREAM'});
    },

    setPrimaryStream(id) {
      Dispatcher.dispatch({actionType: 'SET_PRIMARY_STREAM', id: id});
    },

    stopLocalStream() {
      Dispatcher.dispatch({actionType: 'STOP_LOCAL_STREAM'});
    },

    toggleAudio(id) {
      Dispatcher.dispatch({actionType: 'TOGGLE_AUDIO', id: id});
    },

    toggleLocalAudio() {
      Dispatcher.dispatch({actionType: 'TOGGLE_LOCAL_AUDIO'});
    },

    toggleLocalVideo() {
      Dispatcher.dispatch({actionType: 'TOGGLE_LOCAL_VIDEO'});
    },
  };
};

Dependency.add('RTCActions', new RTCActions());
