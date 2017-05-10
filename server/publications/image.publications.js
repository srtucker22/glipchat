// TODO: refactor
import { check, Match } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import Images from '../../lib/images';

// publish images owned by user
Meteor.publish('images', function() {
  check(arguments, Match.Maybe({}));
  return Images.find({ 'meta.owner': this.userId }).cursor;
});
