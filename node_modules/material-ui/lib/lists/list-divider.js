'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _divider = require('../divider');

var _divider2 = _interopRequireDefault(_divider);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ListDivider = _react2.default.createClass({
  displayName: 'ListDivider',
  getInitialState: function getInitialState() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, '<ListDivider /> has been deprecated. Please use the <Divider /> component.') : undefined;
    return null;
  },
  render: function render() {
    return _react2.default.createElement(_divider2.default, this.props);
  }
});

exports.default = ListDivider;
module.exports = exports['default'];