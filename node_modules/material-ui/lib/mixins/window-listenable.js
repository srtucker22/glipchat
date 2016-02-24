'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('../utils/events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  componentDidMount: function componentDidMount() {
    var listeners = this.windowListeners;

    for (var eventName in listeners) {
      var callbackName = listeners[eventName];
      _events2.default.on(window, eventName, this[callbackName]);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    var listeners = this.windowListeners;

    for (var eventName in listeners) {
      var callbackName = listeners[eventName];
      _events2.default.off(window, eventName, this[callbackName]);
    }
  }
};
module.exports = exports['default'];