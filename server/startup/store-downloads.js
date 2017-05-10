import { Meteor } from 'meteor/meteor';
// import appRoot from 'app-root-path';
// import fs from 'fs';

// pipe the electron app to public downloads
if (Meteor.settings.electron) {
  // const APP_NAME = Meteor.settings.electron.name;

  // fs.createReadStream(`${appRoot.path}/.meteor-electron/darwin-x64/final/${APP_NAME}.zip`)
  //   .pipe(fs.createWriteStream(`${appRoot.path}/public/downloads/darwin-x64/${APP_NAME}.zip`));
}
