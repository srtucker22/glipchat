// first, remove configuration entry in case service is already configured
ServiceConfiguration.configurations.remove({
  service: {$exists: true},
});

ServiceConfiguration.configurations.insert({
  service: 'facebook',
  appId: Meteor.settings.facebook.appId,
  secret: Meteor.settings.facebook.secret,
});

ServiceConfiguration.configurations.insert({
  service: 'google',
  clientId: Meteor.settings.google.clientId,
  secret: Meteor.settings.google.clientSecret,
});
