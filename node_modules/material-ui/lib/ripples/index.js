'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TouchRipple = exports.FocusRipple = exports.CircleRipple = undefined;

var _circleRipple = require('./circle-ripple');

var _circleRipple2 = _interopRequireDefault(_circleRipple);

var _focusRipple = require('./focus-ripple');

var _focusRipple2 = _interopRequireDefault(_focusRipple);

var _touchRipple = require('./touch-ripple');

var _touchRipple2 = _interopRequireDefault(_touchRipple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.CircleRipple = _circleRipple2.default;
exports.FocusRipple = _focusRipple2.default;
exports.TouchRipple = _touchRipple2.default;
exports.default = {
  CircleRipple: _circleRipple2.default,
  FocusRipple: _focusRipple2.default,
  TouchRipple: _touchRipple2.default
};