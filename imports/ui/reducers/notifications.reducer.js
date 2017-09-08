import * as constants from '../constants/constants';

const initialState = {
  active: null,
  notifications: [],
};

export const notificationsReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case constants.SET_ACTIVE_NOTIFICATION:
      return {
        notifications: state.notifications,
        active: action.active,
      };
    case constants.SET_NOTIFICATIONS:
      return {
        notifications: action.notifications,
        active: state.active,
      };
    default:
      return state;
  }
};

export default notificationsReducer;
