import {Meteor} from 'meteor/meteor';

export const roomStream = new Meteor.Streamer('rooms');
export const notificationStream = new Meteor.Streamer('notifications');
