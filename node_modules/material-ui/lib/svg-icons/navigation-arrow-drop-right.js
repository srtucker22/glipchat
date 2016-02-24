'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _svgIcon = require('../svg-icon');

var _svgIcon2 = _interopRequireDefault(_svgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NavigationArrowDropRight = _react2.default.createClass({
  displayName: 'NavigationArrowDropRight',
  render: function render() {
    return _react2.default.createElement(
      _svgIcon2.default,
      this.props,
      _react2.default.createElement('path', { d: 'M9.5,7l5,5l-5,5V7z' })
    );
  }
});

exports.default = NavigationArrowDropRight;
module.exports = exports['default'];