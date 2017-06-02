import { _ } from 'meteor/underscore';
import Immutable from 'seamless-immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as constants from '../constants/constants';

const initialState = Immutable({
  localStream: {},
  remoteStreams: {},
});

export const rtcReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case REHYDRATE: {
      const incoming = action.payload;
      return state;
    }
    case constants.SET_REMOTE_VIDEO: {
      const remoteStreams = {
        [action.id]: { hideVideo: action.hideVideo },
      };
      return Immutable.merge(state, { remoteStreams }, { deep: true });
    }
    case constants.ADD_REMOTE_STREAM: {
      const remoteStreams = {
        [action.id]: Object.assign(action.tracks, { ready: true }),
      };
      return Immutable.merge(state, { remoteStreams }, { deep: true });
    }
    case constants.UPDATE_REMOTE_STREAM: {
      const remoteStreams = {
        [action.id]: action.tracks,
      };
      return Immutable.merge(state, { remoteStreams }, { deep: true });
    }
    case constants.REMOVE_REMOTE_STREAM:
      return Immutable.set(state, 'remoteStreams', _.omit(state.remoteStreams, action.id));
    case constants.GET_LOCAL_STREAM: {
      const localStream = { loading: true };
      return Immutable.merge(state, { localStream }, { deep: true });
    }
    case constants.SET_LOCAL_STREAM: {
      const localStream = {
        loading: false,
        error: null,
        audio: true,
        video: true,
      };
      return Immutable.merge(state, { localStream }, { deep: true });
    }

    case constants.STOP_LOCAL_STREAM: {
      return Immutable.set(state, 'localStream', {});
    }

    case constants.LOCAL_STREAM_ERROR: {
      const localStream = {
        loading: false,
        error: action.error,
      };

      return Immutable.merge(state, { localStream }, { deep: true });
    }
    case constants.LEAVE_ROOM_STREAM:
      return Immutable.set(state, 'files', {});

    case constants.TOGGLE_LOCAL_AUDIO: {
      const localStream = { audio: action.enabled };
      return Immutable.merge(state, { localStream }, { deep: true });
    }
    case constants.TOGGLE_REMOTE_AUDIO: {
      const remoteStreams = {
        [action.id]: { muted: !action.enabled },
      };
      return Immutable.merge(state, { remoteStreams }, { deep: true });
    }
    case constants.TOGGLE_LOCAL_VIDEO: {
      const localStream = { video: action.enabled };
      return Immutable.merge(state, { localStream }, { deep: true });
    }
    case constants.JOIN_ROOM_STREAM:
    default:
      return state;
  }
};

export default rtcReducer;
