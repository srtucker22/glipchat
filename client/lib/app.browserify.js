Browser = require('bowser');
Browser.mac = /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/.test(navigator.userAgent);
Browser.electron = Electron.isDesktop();
TagsInput = require('react-tagsinput');
require('webrtc-adapter-test');
injectTapEventPlugin();
