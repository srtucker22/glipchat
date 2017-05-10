/**
 * client imports and initialization
 */

import 'react-fastclick';
import 'webrtc-adapter';
import 'buffer';
import { analytics } from 'meteor/okgrow:analytics';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import Browser from 'bowser';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';
import * as config from '../lib/config';
import Root from './components/root.component';
import Electron from './utils/electron.utils';

Browser.mac = /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/
  .test(navigator.userAgent) && !Browser.ios;
Browser.electron = Electron.isDesktop();

injectTapEventPlugin();

Meteor.startup(() => {
  if (Meteor.isDevelopment) {
    analytics.debug();  // show the analytics debug log if testing locally
  }

  render(
    <Root />,
    document.getElementById('root'),
  );

  document.title = config.APP_NAME; // set the title for the app

  window.addEventListener('dragover', function(e) {
    e = e || event; // eslint-disable-line no-param-reassign
    e.preventDefault();
  }, false);

  window.addEventListener('drop', function(e) {
    e = e || event; // eslint-disable-line no-param-reassign
    e.preventDefault();
  }, false);
});
