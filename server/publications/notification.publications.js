import {Push} from 'meteor/raix:push';

Push.allow({
  send: function(userId, notification) {
    return true; // Allow all users to send
  },
});
