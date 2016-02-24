'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = muiThemeable;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

function muiThemeable(WrappedComponent) {
  var MuiComponent = function MuiComponent(props, _ref) {
    var _ref$muiTheme = _ref.muiTheme;
    var muiTheme = _ref$muiTheme === undefined ? (0, _getMuiTheme2.default)() : _ref$muiTheme;

    return _react2.default.createElement(WrappedComponent, _extends({}, props, { muiTheme: muiTheme }));
  };

  MuiComponent.displayName = getDisplayName(WrappedComponent);
  MuiComponent.contextTypes = {
    muiTheme: _react2.default.PropTypes.object
  };
  MuiComponent.childContextTypes = {
    muiTheme: _react2.default.PropTypes.object
  };

  return MuiComponent;
}
module.exports = exports['default'];