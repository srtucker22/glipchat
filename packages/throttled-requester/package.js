Package.describe({
  name: 'srtucker22:throttled-requester',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'queue and execute requests to a rate limited API without getting throttled',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  'fibers': '1.0.9'
});

Package.onUse(function(api) {
  api.versionsFrom('1.3-cordova-beta.3');
  api.use('ecmascript');
  api.use('underscore');
  api.use('momentjs:moment@2.11.2');
  api.addFiles('throttled-requester.js', 'server');
  api.export('ThrottledRequester', 'server');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('srtucker22:throttled-requester');
  api.addFiles('throttled-requester-tests.js');
});
