import { Meteor } from 'meteor/meteor';
import Browser from 'bowser';
import * as constants from '../constants/constants';
import { GOOGLE_PERMISSIONS } from '../../lib/config';

export const loginAsGuest = () => (dispatch) => {
  dispatch({
    type: constants.LOGIN_AS_GUEST,
  });

  Meteor.loginVisitor(undefined, (error) => {
    if (error) {
      return dispatch({
        type: constants.LOGIN_ERROR,
        error,
      });
    }
  });
};

export const loginWithGoogle = () => (dispatch) => {
  dispatch({
    type: constants.LOGIN_WITH_GOOGLE,
  });

  Meteor.loginWithGoogle({
    requestPermissions: GOOGLE_PERMISSIONS,
    loginStyle: (Browser.mobile || Browser.tablet) ? 'redirect' : 'popup',
    requestOfflineToken: true,
    forceApprovalPrompt: true,
  }, (error) => {
    if (error) {
      return dispatch({
        type: constants.LOGIN_ERROR,
        error,
      });
    }
  });
};

export const loginWithPassword = () => ({
  type: constants.LOGIN_WITH_PASSWORD,
});

export const logout = () => (dispatch) => {
  dispatch({
    type: 'LOGOUT',
  });

  Meteor.logout((error) => {
    if (error) {
      return dispatch({
        type: constants.LOGOUT_ERROR,
        error,
      });
    }
  });
};

export const updateProfileName = name => (dispatch) => {
  dispatch({
    type: constants.UPDATE_PROFILE_NAME,
    name,
  });

  Meteor.users.update(
    { _id: Meteor.userId() },
    { $set: { 'profile.name': name } },
    (error) => {
      if (error) {
        return dispatch({
          type: constants.AUTH_ERROR,
          error,
        });
      }
    },
  );
};
