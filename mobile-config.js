// Set a new access rule based on origin domain for your app
App.accessRule('https://fonts.googleapis.com/*');
App.accessRule('https://fonts.gstatic.com/*');
App.accessRule('blob:*');

// Make the app fullscreen
App.setPreference('fullscreen', 'true');
