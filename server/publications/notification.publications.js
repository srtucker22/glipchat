import { Meteor } from 'meteor/meteor';
import { Notifications } from '../../lib/notifications';

// publish all notifications
Meteor.publish('notifications', function() {
  return Notifications.find({ owner: this.userId });
});
