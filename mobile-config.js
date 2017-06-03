// Set a new access rule based on origin domain for your app
App.accessRule('http://api.segment.io/*');
App.accessRule('https://fonts.googleapis.com/*');
App.accessRule('https://fonts.gstatic.com/*');
App.accessRule('https://lh3.googleusercontent.com/*');
App.accessRule('https://quasar.meteor.com/*');
App.accessRule('blob:*');
App.accessRule('android-webview-video-poster:default_video_poster');

// Make the app fullscreen
App.setPreference('fullscreen', 'true');
App.setPreference('HideKeyboardFormAccessoryBar', true);
App.setPreference('Orientation', 'default');
