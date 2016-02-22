Browser = require('bowser');
Browser.mac = /(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/
  .test(navigator.userAgent) && !Browser.ios;
Browser.electron = Electron.isDesktop();

TagsInput = require('react-tagsinput');
require('webrtc-adapter-test');
ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
ReactScrollComponents = require('react-scroll-components');
Q = require('q');
injectTapEventPlugin();

Meteor.startup(function() {
  if (WebAppCordova) {
    var fileUrlRegEx = /^file:\/\/(.*)/;
    WebAppCordova.localFileSystemUrl = function(fileUrl) {
      var match = fileUrlRegEx.exec(fileUrl);
      if (!match) return fileUrl;

      var path = match[1];
      return '/local-filesystem' + path;
    };
  }
});
