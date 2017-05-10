import { CREATE_MESSAGE, SET_MESSAGES } from '../constants/constants';

export const messagesReducer = (state = [], action = {}) => {
  switch (action.type) {
    case SET_MESSAGES:
      return action.messages;
    case CREATE_MESSAGE:
    default:
      return state;
  }
};

export default messagesReducer;
