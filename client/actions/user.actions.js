import {GOOGLE_PERMISSIONS} from '../../lib/config';
import {Meteor} from 'meteor/meteor';
import * as constants from '../constants/constants';
import Browser from 'bowser';

export const loginAsGuest = ()=> {
  return (dispatch, getState)=> {
    dispatch({
      type: constants.LOGIN_AS_GUEST,
    });

    Meteor.loginVisitor(undefined, (error)=> {
      if (error) {
        return dispatch({
          type: constants.LOGIN_ERROR,
          error,
        });
      }
    });
  };
};

export const loginWithGoogle = ()=> {
  return (dispatch, getState)=> {
    dispatch({
      type: constants.LOGIN_WITH_GOOGLE,
    });

    Meteor.loginWithGoogle({
      requestPermissions: GOOGLE_PERMISSIONS,
      loginStyle: (Browser.mobile || Browser.tablet) ? 'redirect' : 'popup',
      requestOfflineToken: true,
      forceApprovalPrompt: true,
    }, (error)=> {
      if (error) {
        return dispatch({
          type: constants.LOGIN_ERROR,
          error,
        });
      }
    });
  };
};

export const loginWithPassword = ()=> {
  return {
    type: constants.LOGIN_WITH_PASSWORD,
  };
};

export const logout = ()=> {
  return (dispatch, getState)=> {
    dispatch({
      type: 'LOGOUT',
    });

    Meteor.logout((error)=> {
      if (error) {
        return dispatch({
          type: constants.LOGOUT_ERROR,
          error,
        });
      }
    });
  };
};

export const updateProfileName = (name)=> {
  return (dispatch, getState)=> {
    dispatch({
      type: constants.UPDATE_PROFILE_NAME,
      name,
    });

    Meteor.users.update(
      {_id: Meteor.userId()},
      {$set: {'profile.name': name}},
      (error)=> {
        if (error) {
          return dispatch({
            type: constants.AUTH_ERROR,
            error,
          });
        }
      }
    );
  };
};
