'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _styles = require('../utils/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var propTypes = {
  /**
   * True if the parent `TextField` is disabled.
   */
  disabled: _react2.default.PropTypes.bool,

  /**
   * Override the inline-styles of the underline when parent `TextField` is disabled.
   */
  disabledStyle: _react2.default.PropTypes.object,

  /**
   * True if the parent `TextField` has an error.
   */
  error: _react2.default.PropTypes.bool,

  /**
   * Override the inline-styles of the underline when parent `TextField` has an error.
   */
  errorStyle: _react2.default.PropTypes.object,

  /**
   * True if the parent `TextField` is focused.
   */
  focus: _react2.default.PropTypes.bool,

  /**
   * Override the inline-styles of the underline when parent `TextField` is focused.
   */
  focusStyle: _react2.default.PropTypes.object,

  /**
   * The material-ui theme applied to this component.
   */
  muiTheme: _react2.default.PropTypes.object.isRequired,

  /**
   * Override the inline-styles of the root element.
   */
  style: _react2.default.PropTypes.object
};

var defaultProps = {
  disabled: false,
  disabledStyle: {},
  error: false,
  errorStyle: {},
  focus: false,
  focusStyle: {},
  style: {}
};

var TextFieldUnderline = function TextFieldUnderline(props) {
  var disabled = props.disabled;
  var disabledStyle = props.disabledStyle;
  var error = props.error;
  var errorStyle = props.errorStyle;
  var focus = props.focus;
  var focusStyle = props.focusStyle;
  var muiTheme = props.muiTheme;
  var style = props.style;
  var errorStyleColor = errorStyle.color;
  var _muiTheme$textField = muiTheme.textField;
  var borderColor = _muiTheme$textField.borderColor;
  var disabledTextColor = _muiTheme$textField.disabledTextColor;
  var errorColor = _muiTheme$textField.errorColor;
  var focusColor = _muiTheme$textField.focusColor;

  var styles = {
    root: {
      border: 'none',
      borderBottom: 'solid 1px',
      borderColor: borderColor,
      bottom: 8,
      boxSizing: 'content-box',
      margin: 0,
      position: 'absolute',
      width: '100%'
    },
    disabled: {
      borderBottom: 'dotted 2px',
      borderColor: disabledTextColor
    },
    focus: {
      borderBottom: 'solid 2px',
      borderColor: focusColor,
      transform: 'scaleX(0)',
      transition: _transitions2.default.easeOut()
    },
    error: {
      borderColor: errorStyleColor ? errorStyleColor : errorColor,
      transform: 'scaleX(1)'
    }
  };

  var underline = (0, _styles.mergeStyles)(styles.root, style);
  var focusedUnderline = (0, _styles.mergeStyles)(underline, styles.focus, focusStyle);

  if (disabled) underline = (0, _styles.mergeStyles)(underline, styles.disabled, disabledStyle);
  if (focus) focusedUnderline = (0, _styles.mergeStyles)(focusedUnderline, { transform: 'scaleX(1)' });
  if (error) focusedUnderline = (0, _styles.mergeStyles)(focusedUnderline, styles.error);

  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement('hr', { style: (0, _styles.prepareStyles)(muiTheme, underline) }),
    _react2.default.createElement('hr', { style: (0, _styles.prepareStyles)(muiTheme, focusedUnderline) })
  );
};

TextFieldUnderline.propTypes = propTypes;
TextFieldUnderline.defaultProps = defaultProps;

exports.default = TextFieldUnderline;
module.exports = exports['default'];