const { app, BrowserWindow } = require('electron');
const path = require('path');
const proxyWindowEvents = require('./proxy-window-events');
const updater = require('electron-simple-updater');

let settings = {};

if (process.env.NODE_ENV !== 'development') {
  settings = require('./settings.json');
}

updater.init({
  checkUpdateOnStart: false,
  autoDownload: false,
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

const rootUrl = settings.rootUrl || 'http://localhost:3000';

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function hideInsteadofClose(e) {
  mainWindow.hide();
  e.preventDefault();
}

app.on('before-quit', function() {
  // We need to remove our close event handler from the main window,
  // otherwise the app will not quit.
  mainWindow.removeListener('close', hideInsteadofClose);
});

app.on('activate', function() {
  // Show the main window when the customer clicks on the app icon.
  if (!mainWindow.isVisible()) mainWindow.show();
});

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: true,
    frame: true,
    /**
     * Disable Electron's Node integration
     * so that browser dependencies like `moment` will load themselves
     * like normal i.e. into the window rather than into modules,
     * and also to prevent untrusted client
     * code from having access to the process and file system:
     *  - https://github.com/atom/electron/issues/254
     *  - https://github.com/atom/electron/issues/1753
     */
    webPreferences: {
      nodeIntegration: false,
      // See comments at the top of `preload.js`.
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(rootUrl);
  mainWindow.focus();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  proxyWindowEvents(mainWindow);

  // Hide the main window instead of closing it, so that we can bring it back
  // more quickly.
  mainWindow.on('close', hideInsteadofClose);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

