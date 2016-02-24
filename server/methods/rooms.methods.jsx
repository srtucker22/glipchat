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

import urlJoin from 'url-join';

var appName = AppDetails.name;
var roomURL = urlJoin(process.env.ROOT_URL, 'room/');

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

// if a user with a google account is online when invited, show them a notification
function notifyOnlineInvitees(user, roomId, invitees, type) {
  // get online invitees
  let onlineInvitees = Meteor.users.find({
    'services.google.email': {$in: _.pluck(invitees, 'email')},
    'status.online': true
  }).fetch();

  _.each(onlineInvitees, (invitee)=> {
    notificationStream.emit(invitee._id, {
      from: user.profile.name,
      room: roomId,
      url: urlJoin(roomURL, roomId),
      type
    });
  });

  // test push
  // Push.debug = true;
  // Push.send({
  //   from: 'Test',
  //   title: 'Hello',
  //   text: 'World',
  //   badge: 12,
  //   query: {}
  // });
}

function renderEmailTemplate(filename, vals) {
  let template = Assets.getText(filename);
  let templateCompiled = _.template(template);

  return templateCompiled(vals);
}

// this is mildly insecure -- if you know a roomId, you can sneak in
// we can make rooms more private in the future by requiring auth types and tracking invites, but this can get tricky if we add more than 1 auth type, like email and google account

// room access server methods
Meteor.methods({
  // create a room and get access
  createRoom() {
    check(arguments, Match.OneOf({}, undefined, null));

    this.unblock();

    let id = Rooms.insert({
      owner: this.userId,
      connected: [],
    });

    Roles.addUsersToRoles(this.userId, id, Roles.GLOBAL_GROUP);

    return id;
  },

  // give user access to a room upon request
  grantRoomAccess(roomId) {
    check(roomId, String);

    this.unblock();

    let currentRoom = Rooms.findOne(roomId);

    if (!currentRoom) {
      throw new Meteor.Error(400, 'Room not found');
    }

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    if (!Roles.userIsInRole(this.userId, roomId)) {
      Roles.addUsersToRoles(this.userId, roomId, Roles.GLOBAL_GROUP);
    }
  },

  invite(roomId, invitees) {
    check(roomId, String);
    check(invitees, [Match.ObjectIncluding({email: String})]);

    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();

    try {
      let user = Meteor.user();

      let nonUsers = _.reject(invitees, (invitee)=> {
        return !!invitee._id;
      });

      if (!!nonUsers && nonUsers.length) {
        // send invite emails to non-users
        let subject = 'You\'ve been invited to a ' + appName + ' video chat';

        let basicMessage = renderEmailTemplate('basic-message.html', {
          appName,
          url: urlJoin(roomURL, roomId),
          username: user.profile.name,
        });

        Email.send({
          to: _.pluck(nonUsers, 'email'),
          from: 'mail@' + appName + '.meteor.com',
          subject: subject,
          html: basicMessage
        });
      }

      // if an invitee is a user but not online, we will notify them via notifications not emails

      // notify online invitees with push notification
      notifyOnlineInvitees(user, roomId, invitees, 'invite');

    } catch (e) {
      throw new Meteor.Error(e.message);
    }
  },

  notifyOnlineInvitees(roomId, invitees, type) {
    check(roomId, String);
    check(invitees, [Match.ObjectIncluding({email: String})]);

    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    let user = Meteor.user();

    notifyOnlineInvitees(user, roomId, invitees, type);
  }
});
