/* global ElectronImplementation:true */

/**
 * Since we've disabled Node integration in the browser window, we must selectively expose
 * main-process/Node modules via this script.
 *
 * @WARNING This file must take care not to leak the imported modules to the browser window!
 * In particular, do not save the following variables as properties of `ElectronImplementation`.
 * See https://github.com/atom/electron/issues/1753#issuecomment-104719851.
 */
const _ = require('underscore');
const ipc = require('electron').ipcRenderer;
const remote = require('electron').remote;
const shell = require('electron').shell;

/**
 * Defines methods with which to extend the `Electron` module defined in `client.js`.
 * This must be a global in order to escape the preload script and be available to `client.js`.
 */
ElectronImplementation = {
  /**
   * Open the given external protocol URL in the desktop's default manner. (For example, http(s):
   * URLs in the user's default browser.)
   *
   * @param {String} url - The URL to open.
   */
  openExternal: shell.openExternal,

  /**
   * Determines if the browser window is currently in fullscreen mode.
   *
   * "Fullscreen" here refers to the state triggered by toggling the native controls, not that
   * toggled by the HTML API.
   *
   * To detect when the browser window changes fullscreen state, observe the 'enter-full-screen'
   * and 'leave-full-screen' events using `onWindowEvent`.
   *
   * @return {Boolean} `true` if the browser window is in fullscreen mode, `false` otherwise.
   */
  isFullScreen() {
    return remote.getCurrentWindow().isFullScreen();
  },

  maximize() {
    return remote.getCurrentWindow().maximize();
  },

  // lite mode
  minimize() {
    return remote.getCurrentWindow().setSize(500, 112, true);
  },

  // custom size
  setSize(width, height, animated) {
    return remote.getCurrentWindow().setSize(width, height, animated);
  },

  /**
   * Invokes _callback_ when the specified `BrowserWindow` event is fired.
   *
   * This differs from `onEvent` in that it directs Electron to start emitting the relevant window
   * event.
   *
   * See https://github.com/atom/electron/blob/master/docs/api/browser-window.md#events for a list
   * of events.
   *
   * The implementation of this API, in particular the use of the `ipc` vs. `remote` modules, is
   * designed to avoid memory leaks as described by
   * https://github.com/atom/electron/blob/master/docs/api/remote.md#passing-callbacks-to-the-main-process.
   *
   * @param {String} event - The name of a `BrowserWindow` event.
   * @param {Function} callback - A function to invoke when `event` is triggered. Takes no arguments
   *   and returns no value.
   */
  onWindowEvent(event, callback) {
    console.log(event, callback);
    this.onEvent(event, callback);
    ipc.send('observe-window-event', event);
  },

  /**
   * Invokes _callback_ when the specified IPC event is fired.
   *
   * @param {String} event - The name of an event.
   * @param {Function} callback - A function to invoke when `event` is triggered. Takes no arguments
   *   and returns no value.
   */
  onEvent(event, callback) {
    let listeners = this.eventListeners[event];
    if (!listeners) {
      listeners = this.eventListeners[event] = [];
      ipc.on(event, function() {
        _.invoke(listeners, 'call');
      });
    }
    listeners.push(callback);
    return callback;
  },

  removeEvent(event, callback) {
    const listeners = this.eventListeners[event];
    if (!listeners) {
      return -1;
    }
    const index = listeners.indexOf(callback);
    if (index > -1) {
      listeners.splice(index, 1);
    }
    return index;
  },

  eventListeners: {},
};
