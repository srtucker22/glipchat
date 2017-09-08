import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import deepExtend from 'deep-extend';

Meteor.startup(() => {
  if (Meteor.isServer) {
    const pjson = require('../../../package.json');
    Meteor.settings.public.version = pjson.version;

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
  }
});

export const ICE_CONFIG = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

// consistent constraints for getUserMedia
// we can modify these later for fancier things
export const GUM_CONSTRAINTS = {
  video: true,
  audio: true,
  // {
  //   // echoCancellation: true,
  //   // googEchoCancellation: true,
  //   // googHighpassFilter: true,
  //   // googNoiseSuppression: true,
  //   // googTypingNoiseDetection: true,
  // },
};

export const VERSION = Meteor.settings.public.version;
export const APP_NAME = Meteor.settings.public.name;
export const APP_EMAIL = 'support@glipchat.herokuapp.com';
export const APP_ICON = '/android-icon-192x192.png';
export const DOWNLOAD_URLS = {
  mac: `/downloads/mac/${APP_NAME}-${VERSION}-mac.zip`,
  windows: `/downloads/mac/${APP_NAME}-${VERSION}-windows.zip`,
};

export const COMPANY = {
  name: 'Glipcode',
  href: 'http://glipcode.com/',
};

// wait time in ms for someone to answer a call
export const RING_DURATION = 60000;

// wait time between gUM calls waiting for permission
export const PERMISSION_INTERVAL = 1000;

export const GITHUB_URL = 'https://github.com/srtucker22/glipchat';

export const GOOGLE_PERMISSIONS = [
  'https://www.googleapis.com/auth/contacts.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];
