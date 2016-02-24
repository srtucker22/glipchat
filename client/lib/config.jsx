import {} from 'webrtc-adapter';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import Browser from 'bowser';
Browser.mac = /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/
  .test(navigator.userAgent) && !Browser.ios;
Browser.electron = Electron.isDesktop();
