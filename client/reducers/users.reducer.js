import { Meteor } from 'meteor/meteor';
import * as constants from '../constants/constants';
import deepExtend from 'deep-extend';

export const usersReducer = (state = {}, action = {})=> {
  switch (action.type) {
    case constants.SET_USERS:
      return action.users;
    case constants.AUTH_ERROR:
    case constants.LOGIN_ERROR:
    case constants.LOGOUT_ERROR:
      return deepExtend(state, {
        authError: action.error,
      });
    case constants.LOGGING_IN:
      return Object.assign({}, state, {user: {loggingIn: true}});
    case constants.CLEAR_AUTH_ERROR:
    case constants.LOGIN:
    case constants.LOGIN_WITH_GOOGLE:
    case constants.LOGIN_WITH_PASSWORD:
    case constants.LOGOUT: {
      const newState = Object.assign({}, state);
      !!newState.authError && delete newState.authError;
      return newState;
    }
    default:
      return state;
  }
};

export default usersReducer;
