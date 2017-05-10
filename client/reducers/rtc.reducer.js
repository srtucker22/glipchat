import { _ } from 'meteor/underscore';
import deepExtend from 'deep-extend';
import { REHYDRATE } from 'redux-persist/constants';
import * as constants from '../constants/constants';

const initialState = {
  localStream: {},
  remoteStreams: {},
};

export const rtcReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload;
      return state;
    }
    case constants.SET_REMOTE_VIDEO: {
      const newStream = {};
      newStream[action.id] = { hideVideo: action.hideVideo };
      return deepExtend({}, state, { remoteStreams: newStream });
    }
    case constants.ADD_REMOTE_STREAM:
    case constants.UPDATE_REMOTE_STREAM: {
      const newStream = {};
      newStream[action.id] = action.tracks;
      return deepExtend({}, state, {
        remoteStreams: newStream,
      });
    }
    case constants.REMOVE_REMOTE_STREAM:
      return Object.assign({}, state, {
        remoteStreams: _.omit(state.remoteStreams, action.id),
      });
    case constants.GET_LOCAL_STREAM: {
      const localStream = {
        loading: true,
      };
      return deepExtend({}, state, { localStream });
    }
    case constants.SET_LOCAL_STREAM: {
      const localStream = {
        loading: false,
        error: null,
        audio: true,
        video: true,
      };
      return deepExtend({}, state, { localStream });
    }

    case constants.STOP_LOCAL_STREAM: {
      const localStream = {};
      return Object.assign({}, state, { localStream });
    }

    case constants.LOCAL_STREAM_ERROR: {
      const localStream = {
        loading: false,
        error: action.error,
      };

      return deepExtend({}, state, { localStream });
    }
    case constants.LEAVE_ROOM_STREAM:
      return Object.assign({}, state, { files: {} });

    case constants.TOGGLE_LOCAL_AUDIO: {
      const localStream = { audio: action.enabled };
      return deepExtend({}, state, { localStream });
    }
    case constants.TOGGLE_REMOTE_AUDIO: {
      const remoteStreams = {};
      remoteStreams[action.id] = { muted: !action.enabled };
      return deepExtend({}, state, { remoteStreams });
    }
    case constants.TOGGLE_LOCAL_VIDEO: {
      const localStream = { video: action.enabled };
      return deepExtend({}, state, { localStream });
    }
    case constants.JOIN_ROOM_STREAM:
    default:
      return state;
  }
};

export default rtcReducer;
