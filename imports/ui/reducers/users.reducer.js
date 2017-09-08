import Immutable from 'seamless-immutable';
import * as constants from '../constants/constants';

const initialState = Immutable({});

export const usersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case constants.SET_USERS:
      return action.users;
    case constants.AUTH_ERROR:
    case constants.LOGIN_ERROR:
    case constants.LOGOUT_ERROR:
      return Immutable.merge(state, {
        authError: action.error,
      });
    case constants.LOGGING_IN:
      return Immutable.set(state, 'user', { loggingIn: true });
    case constants.CLEAR_AUTH_ERROR:
    case constants.LOGIN:
    case constants.LOGIN_WITH_GOOGLE:
    case constants.LOGIN_WITH_PASSWORD:
    case constants.LOGOUT: {
      if (state.authError) {
        Immutable.without(state, 'authError');
      }
      return state;
    }
    default:
      return state;
  }
};

export default usersReducer;
