'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
  displayName: 'theme-wrapper',

  propTypes: {
    children: _react2.default.PropTypes.node,
    theme: _react2.default.PropTypes.object.isRequired
  },

  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  getChildContext: function getChildContext() {
    return {
      muiTheme: this.props.theme
    };
  },
  render: function render() {
    return this.props.children;
  }
});
module.exports = exports['default'];