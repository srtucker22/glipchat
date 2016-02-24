'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _events = require('../utils/events');

var _events2 = _interopRequireDefault(_events);

var _dom = require('../utils/dom');

var _dom2 = _interopRequireDefault(_dom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {

  //When the component mounts, listen to click events and check if we need to
  //Call the componentClickAway function.

  componentDidMount: function componentDidMount() {
    if (!this.manuallyBindClickAway) this._bindClickAway();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._unbindClickAway();
  },
  _checkClickAway: function _checkClickAway(event) {
    if (this.isMounted()) {
      var el = _reactDom2.default.findDOMNode(this);

      // Check if the target is inside the current component
      if (event.target !== el && !_dom2.default.isDescendant(el, event.target) && document.documentElement.contains(event.target)) {
        if (this.componentClickAway) this.componentClickAway(event);
      }
    }
  },
  _bindClickAway: function _bindClickAway() {
    // On touch-enabled devices, both events fire, and the handler is called twice,
    // but it's fine since all operations for which the mixin is used
    // are idempotent.
    _events2.default.on(document, 'mouseup', this._checkClickAway);
    _events2.default.on(document, 'touchend', this._checkClickAway);
  },
  _unbindClickAway: function _unbindClickAway() {
    _events2.default.off(document, 'mouseup', this._checkClickAway);
    _events2.default.off(document, 'touchend', this._checkClickAway);
  }
};
module.exports = exports['default'];