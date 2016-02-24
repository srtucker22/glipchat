'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var horizontal = _react2.default.PropTypes.oneOf(['left', 'middle', 'right']);
var vertical = _react2.default.PropTypes.oneOf(['top', 'center', 'bottom']);

exports.default = {

  corners: _react2.default.PropTypes.oneOf(['bottom-left', 'bottom-right', 'top-left', 'top-right']),

  horizontal: horizontal,

  vertical: vertical,

  origin: _react2.default.PropTypes.shape({
    horizontal: horizontal,
    vertical: vertical
  }),

  cornersAndCenter: _react2.default.PropTypes.oneOf(['bottom-center', 'bottom-left', 'bottom-right', 'top-center', 'top-left', 'top-right']),

  stringOrNumber: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.number]),

  zDepth: _react2.default.PropTypes.oneOf([0, 1, 2, 3, 4, 5])

};
module.exports = exports['default'];