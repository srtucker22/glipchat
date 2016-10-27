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

import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import * as constants from '../constants/constants';

export const createRoom = (invitees)=> (dispatch, getState)=> {
  dispatch({
    type: constants.CREATE_ROOM,
    invitees,
  });

  Meteor.call('createRoom', invitees, (error, id)=> {
    if (error) {
      console.error(error);
      return dispatch({
        type: constants.ROOM_ERROR,
        error,
      })
    } else {
      console.log(id);
      return dispatch(setCurrentRoom(id));
    }
  });
};

export const inviteUsersToRoom = (invitees)=> ({
  type: constants.INVITE_USERS_TO_ROOM,
  invitees,
});

export const leaveRoom = ()=> ({
  type: constants.LEAVE_ROOM,
});

export const retryInvitiations = ()=> {
  return {
    type: constants.RETRY_INVITATIONS,
  };
};

export const setCurrentRoom = (id)=> (dispatch, getState)=> {
  const success = ()=> {
    Session.set('currentRoom', id);
    return dispatch({
      type: constants.SET_CURRENT_ROOM,
      id,
    });
  };

  const {users : user} = getState();

  if (Roles.userIsInRole(user._id, [id])) {
    return success();
  } else {
    Meteor.call('grantRoomAccess', id, (error)=> {
      if (error) {
        return dispatch({
          type: constants.ROOM_ERROR,
          error,
        });
      } else {
        return success();
      }
    });
  }
};
