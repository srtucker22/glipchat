import Immutable from 'seamless-immutable';
import * as constants from '../constants/constants';

const initialState = Immutable({});

export const roomsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case constants.LEAVE_ROOM:
      return Immutable.merge(state, { current: null }, { deep: true });
    case constants.SET_CURRENT_ROOM:
      return Immutable.merge(state, { current: action.id }, { deep: true });
    case constants.SET_ROOMS:
      return Immutable.merge(state, { available: action.available }, { deep: true });
    case constants.CREATE_ROOM:
    default:
      return state;
  }
};

export default roomsReducer;
