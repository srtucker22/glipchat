import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import * as constants from '../constants/constants';
import { currentRoom } from '../stores/reactive-var.store';

export const setCurrentRoom = id => (dispatch, getState) => {
  const success = () => {
    currentRoom.set(id);
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

export const createRoom = invitees => (dispatch) => {
  dispatch({
    type: constants.CREATE_ROOM,
    invitees,
  });

  Meteor.call('createRoom', invitees, (error, id) => {
    if (error) {
      // eslint-disable-next-line no-console
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
  Meteor.call('invite', current, invitees, (error) => {
    if (error) {
      // eslint-disable-next-line no-console
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
  currentRoom.set(undefined);
  return { type: constants.LEAVE_ROOM };
};

export const retryInvitiations = () => ({
  type: constants.RETRY_INVITATIONS,
});
