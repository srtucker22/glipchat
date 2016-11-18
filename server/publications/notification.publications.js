import {Meteor} from 'meteor/meteor';
import {Notificactions} from '../../lib/notifications';

// publish all notifications
Meteor.publish('notifications', function() {
  return Notificactions.find({owner: this.userId});
});
