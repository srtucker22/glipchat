import * as constants from '../constants/constants';
import deepExtend from 'deep-extend';
import { Meteor } from 'meteor/meteor';

export const roomsReducer = (state = {}, action = {})=> {
  switch (action.type) {
    case constants.SET_CURRENT_ROOM:
      return deepExtend({}, state, {
        current: action.id,
      });
    case constants.SET_ROOMS:
      return deepExtend({}, state, {
        available: action.available,
      });
    case constants.CREATE_ROOM:
    default:
      return state;
  }
};

export default roomsReducer;
