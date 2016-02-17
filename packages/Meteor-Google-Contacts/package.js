Package.describe({
  name: 'long:google-contacts',
  summary: 'Google-Contacts package',
  version: '0.2.1',
  git: 'https://github.com/iyou/Meteor-Google-Contacts.git'
});

Package.onUse(function (api) {
  api.versionsFrom('0.9.0');
  api.addFiles('index.js', 'server');
  api.export('GoogleContacts');
});

Npm.depends({
  'underscore': '1.5.2'
});
