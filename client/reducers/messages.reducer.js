import constants from '../constants/constants';
import deepExtend from 'deep-extend';

export const messagesReducer = (state = [], action = {})=> {
  switch (action.type) {
    case constants.SET_MESSAGES:
      return action.messages;
    case constants.CREATE_MESSAGE:
    default:
      return state;
  }
};

export default messagesReducer;
