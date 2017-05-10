import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import deepExtend from 'deep-extend';
import pjson from '../../package.json';

Meteor.startup(() => {
  // push the package.json deets to Meteor.public
  deepExtend(Meteor.settings.public, {
    name: pjson.name,
    version: pjson.version,
  });

  if (Meteor.settings.google) {
    Meteor.settings.public.google = {
      apiKey: Meteor.settings.google.apiKey,
      browserKey: Meteor.settings.google.browserKey,
    };
  }

  // first, remove configuration entry in case service is already configured
  ServiceConfiguration.configurations.remove({
    service: { $exists: true },
  });

  if (Meteor.settings.google) {
    ServiceConfiguration.configurations.insert({
      service: 'google',
      clientId: Meteor.settings.google.clientId,
      secret: Meteor.settings.google.clientSecret,
    });
  }
});
