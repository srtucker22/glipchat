import constants from '../constants/constants';

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
