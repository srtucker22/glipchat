import {check, Match} from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import {notificationStream} from '../../lib/streams';
import {Rooms} from '../../lib/rooms';
import urlJoin from 'url-join';
import * as config from '../../lib/config';

var appName = config.APP_NAME;
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

// TODO: add invitees to room
// room access server methods
Meteor.methods({
  // create a room and get access
  createRoom(invitees) {
    check(invitees, Match.Maybe([
      Match.ObjectIncluding({
        _id: Match.Maybe(String),
        email: Match.Maybe(String),
      })
    ]));

    this.unblock();

    const id = Rooms.insert({
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

    return true;
  },

  invite(roomId, invitees) {
    check(roomId, String);
    check(invitees, [Match.ObjectIncluding({email: String})]);

    this.unblock();

    if (!this.userId) {
      throw new Meteor.Error(401, 'No user');
    }

    try {
      const user = Meteor.users.findOne({_id: this.userId});

      let nonUsers = _.reject(invitees, (invitee)=> {
        return !!invitee._id;
      });

      if (!!nonUsers && nonUsers.length) {
        // send invite emails to non-users
        let subject = 'You\'ve been invited to a ' + appName + ' video chat';

        const joinTemplate = renderEmailTemplate('join-template.html', {
          appName,
          url: urlJoin(roomURL, roomId),
          username: user.profile.name,
        });

        Email.send({
          to: _.pluck(nonUsers, 'email'),
          from: 'mail@' + appName + '.meteor.com',
          subject: subject,
          html: joinTemplate
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
