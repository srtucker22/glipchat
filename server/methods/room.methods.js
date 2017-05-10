import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import urlJoin from 'url-join';
import * as notificationUtils from '../utils/notification.utils';
import { Rooms } from '../../lib/rooms';
import { APP_NAME, APP_EMAIL } from '../../lib/config';

const roomURL = '/room/';

_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g,
};

function renderEmailTemplate(filename, vals) {
  const template = Assets.getText(filename); // eslint-disable-line no-undef
  const templateCompiled = _.template(template);

  return templateCompiled(vals);
}

// if a user with a google account is online when invited, show them a notification
function notifyInvitees(user, roomId, invitees) {
  console.log('notifyInvitees', arguments);
  return notificationUtils.sendNotifications(_.pluck(invitees, '_id'), {
    actions: ['join'],
    body: `${user.profile.name} invited you to chat`,
    room: roomId,
    icon: '/android-icon-192x192.png',
    title: 'Video chat invitation',
    type: 'ROOM_INVITE',
  });
}

function invite(user, roomId, invitees) {
  try {
    const userInvitees = Meteor.users.find({
      'services.google.email': { $in: _.pluck(invitees, 'email') },
    }).fetch({
      _id: 1,
      'services.google.email': 1,
    }).map(i => ({
      _id: i._id,
      email: i.services.google.email,
    }));
    const indexedUserInvitees = _.indexBy(userInvitees, 'email');

    const nonUsers = _.reject(invitees, invitee => !!indexedUserInvitees[invitee.email]);

    if (!!nonUsers && nonUsers.length) {
      // send invite emails to non-users
      const subject = `${user.profile.name} has invited you to a ${APP_NAME} video chat`;

      const joinTemplate = renderEmailTemplate('join-template.html', {
        appName: APP_NAME,
        url: urlJoin(roomURL, roomId),
        username: user.profile.name,
      });

      Email.send({
        to: _.pluck(nonUsers, 'email'),
        from: APP_EMAIL,
        subject,
        html: joinTemplate,
      });
    }

    // notify invitees with push notification
    return notifyInvitees(user, roomId, userInvitees);
  } catch (e) {
    throw new Meteor.Error(e.message);
  }
}

// this is mildly insecure -- if you know a roomId, you can sneak in
// we can make rooms more private in the future by requiring auth types and tracking invites
// but this can get tricky if we add more than 1 auth type, like email and google account

// TODO: add invitees to room
// room access server methods
Meteor.methods({
  // create a room and get access
  createRoom(invitees) {
    check(invitees, Match.Maybe([
      Match.ObjectIncluding({
        _id: Match.Maybe(String),
        email: Match.Maybe(String),
      }),
    ]));

    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    const user = Meteor.users.findOne({ _id: this.userId });

    if (!user) {
      throw new Meteor.Error(401, 'No user');
    }

    const id = Rooms.insert({
      owner: this.userId,
      connected: [],
    });

    Roles.addUsersToRoles(this.userId, id, Roles.GLOBAL_GROUP);

    // send notifications to invitees
    if (invitees) {
      invite(user, id, invitees);
    }

    return id;
  },

  // give user access to a room upon request
  grantRoomAccess(roomId) {
    check(roomId, String);

    this.unblock();

    const currentRoom = Rooms.findOne(roomId);

    if (!currentRoom) {
      throw new Meteor.Error(400, 'Room not found');
    }

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    if (!Roles.userIsInRole(this.userId, roomId)) {
      Roles.addUsersToRoles(this.userId, roomId, Roles.GLOBAL_GROUP);
    }

    return true;
  },

  invite(roomId, invitees) {
    check(roomId, String);
    check(invitees, [Match.ObjectIncluding({ email: String })]);

    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    const user = Meteor.users.findOne({ _id: this.userId });

    if (!user) {
      throw new Meteor.Error(401, 'No user');
    }

    invite(user, roomId, invitees);
  },

  notifyInvitees(roomId, invitees) {
    check(roomId, String);
    check(invitees, [Match.ObjectIncluding({ email: String })]);

    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    const user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, 'No user found');
    }

    const userInvitees = Meteor.users.find({
      'services.google.email': { $in: _.pluck(invitees, 'email') },
    }).fetch({
      _id: 1,
    });

    return notifyInvitees(user, roomId, userInvitees);
  },
});
