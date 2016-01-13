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

var RoomActions = function() {
  return {
    clearInvitees() {
      Dispatcher.dispatch({actionType: 'CLEAR_INVITEES'});
    },

    createRoom() {
      Dispatcher.dispatch({actionType: 'CREATE_ROOM'});
    },

    hideControls() {
      Dispatcher.dispatch({
        actionType: 'HIDE_CONTROLS',
      });
    },

    hideInviteModal() {
      Dispatcher.dispatch({
        actionType: 'HIDE_INVITE_MODAL',
      });
    },

    invite(invitees) {
      Dispatcher.dispatch({
        actionType: 'INVITE',
        invitees,
      });
    },

    joinRoom(roomId) {
      Dispatcher.dispatch({
        actionType: 'JOIN_ROOM',
        roomId
      });
    },

    joinRoomStream(roomId) {
      Dispatcher.dispatch({
        actionType: 'JOIN_ROOM_STREAM',
        roomId
      });
    },

    leaveRoom() {
      Dispatcher.dispatch({
        actionType: 'LEAVE_ROOM',
      });
    },

    showControls(delay) {
      Dispatcher.dispatch({
        actionType: 'SHOW_CONTROLS',
        delay,
      });
    },

    showInviteModal() {
      Dispatcher.dispatch({
        actionType: 'SHOW_INVITE_MODAL',
      });
    },

    updateInvitees(invitees) {
      Dispatcher.dispatch({actionType: 'UPDATE_INVITEES', invitees});
    },
  };
};

Dependency.add('RoomActions', new RoomActions());
