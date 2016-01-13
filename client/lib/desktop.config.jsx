// for future use with Electron
Meteor.startup(()=> {
  Meteor.isDesktop = navigator.userAgent.indexOf('Electron') > -1;
});
