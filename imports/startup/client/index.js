import 'react-fastclick';
import 'webrtc-adapter';
import 'buffer';
import { analytics } from 'meteor/okgrow:analytics';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import Browser from 'bowser';
import injectTapEventPlugin from 'react-tap-event-plugin';
import React from 'react';

import './remove-stream.polyfill';
import { APP_NAME } from '../../api/lib/config';
import Root from '../../ui/components/root.component';
import Electron from '../../ui/utils/electron.utils';

import '../../ui/styles/styles.css';
import '../../ui/styles/react-select-override.css';

Browser.mac = /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/
  .test(navigator.userAgent) && !Browser.ios;
Browser.electron = Electron.isDesktop();

injectTapEventPlugin();

Meteor.startup(() => {
  if (Meteor.isDevelopment) {
    analytics.debug();  // show the analytics debug log if testing locally
  }

  if (Meteor.isCordova) {
    StatusBar.overlaysWebView(false);
    StatusBar.hide();
  }

  render(
    <Root />,
    document.getElementById('root'),
  );

  document.title = APP_NAME; // set the title for the app

  window.addEventListener('dragover', function(e) {
    e = e || event; // eslint-disable-line no-param-reassign
    e.preventDefault();
  }, false);

  window.addEventListener('drop', function(e) {
    e = e || event; // eslint-disable-line no-param-reassign
    e.preventDefault();
  }, false);
});
