import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import * as constants from '../constants/constants';

export const createRoom = invitees => (dispatch, getState) => {
  dispatch({
    type: constants.CREATE_ROOM,
    invitees,
  });

  Meteor.call('createRoom', invitees, (error, id) => {
    if (error) {
      console.error(error);
      return dispatch({
        type: constants.ROOM_ERROR,
        error,
      });
    }
    return dispatch(setCurrentRoom(id));
  });
};

export const inviteUsersToRoom = invitees => (dispatch, getState) => {
  const { rooms: { current } } = getState();
  console.log('current', current, 'invitees', invitees);
  Meteor.call('invite', current, invitees, (error, id) => {
    if (error) {
      console.error(error);
      return dispatch({
        type: constants.ROOM_ERROR,
        error,
      });
    }
    return {
      type: constants.INVITE_USERS_TO_ROOM,
      invitees,
    };
  });
};

export const leaveRoom = () => {
  Session.set('currentRoom', undefined);
  return { type: constants.LEAVE_ROOM };
};

export const retryInvitiations = () => ({
  type: constants.RETRY_INVITATIONS,
});

export const setCurrentRoom = id => (dispatch, getState) => {
  const success = () => {
    Session.set('currentRoom', id);
    return dispatch({
      type: constants.SET_CURRENT_ROOM,
      id,
    });
  };

  const { users: user } = getState();

  if (Roles.userIsInRole(user._id, [id])) {
    return success();
  }
  Meteor.call('grantRoomAccess', id, (error) => {
    if (error) {
      return dispatch({
        type: constants.ROOM_ERROR,
        error,
      });
    }
    return success();
  });
};
