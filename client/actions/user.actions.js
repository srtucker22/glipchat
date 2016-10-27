/**
 * quasar
 *
 * Copyright (c) 2015 Glipcode http://glipcode.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions
 * of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED
 * TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *
 */
import {GOOGLE_PERMISSIONS} from '../../lib/config';
import {Meteor} from 'meteor/meteor';
import * as constants from '../constants/constants';
import Browser from 'bowser';

export const loginAsGuest = ()=> {
  return (dispatch, getState)=> {
    dispatch({
      type: constants.LOGIN_AS_GUEST
    });

    Meteor.loginVisitor(undefined, (error)=> {
      if (error) {
        return dispatch({
          type: constants.LOGIN_ERROR,
          error,
        });
      }
    })
  };
};

export const loginWithGoogle = ()=> {
  return (dispatch, getState)=> {
    dispatch({
      type: constants.LOGIN_WITH_GOOGLE
    });

    Meteor.loginWithGoogle({
      requestPermissions: GOOGLE_PERMISSIONS,
      loginStyle: (Browser.mobile || Browser.tablet) ? 'redirect' : 'popup',
      requestOfflineToken: true,
      forceApprovalPrompt: true
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
    type: constants.LOGIN_WITH_PASSWORD
  };
};

export const logout = ()=> {
  return (dispatch, getState)=> {
    dispatch({
      type: 'LOGOUT'
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
            error
          });
        }
      }
    );
  };
};
