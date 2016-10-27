import { Meteor } from 'meteor/meteor';

let root;

if (Meteor.isProduction) {
  root = require('./root.prod.component').default;
} else {
  root = require('./root.dev.component').default;
}

export default root;
