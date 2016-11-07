import {Meteor} from 'meteor/meteor';
import {Push} from 'meteor/raix:push';
import {ServiceConfiguration} from 'meteor/service-configuration';

// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: {$exists: true},
});

if (Meteor.settings.google) {
  ServiceConfiguration.configurations.insert({
    service: 'google',
    clientId: Meteor.settings.google.clientId,
    secret: Meteor.settings.google.clientSecret,
  });
}

if (Meteor.settings.push) {
  Push.Configure(Meteor.settings.push);
}
