'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _divider = require('../divider');

var _divider2 = _interopRequireDefault(_divider);

var _styles = require('../utils/styles');

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var MenuDivider = _react2.default.createClass({
  displayName: 'MenuDivider',

  propTypes: {
    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
  },

  getInitialState: function getInitialState() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, '<MenuDivider /> has been deprecated. Please use the <Divider /> component.') : undefined;
    return null;
  },
  getStyles: function getStyles() {
    return {
      root: {
        marginTop: 7,
        marginBottom: 8
      }
    };
  },
  render: function render() {
    var _props = this.props;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['style']);

    var styles = this.getStyles();

    return _react2.default.createElement(_divider2.default, _extends({}, this.props, { style: (0, _styles.mergeStyles)(styles.root, style) }));
  }
});

exports.default = MenuDivider;
module.exports = exports['default'];