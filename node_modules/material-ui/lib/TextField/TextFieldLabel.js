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
   * The material-ui theme applied to this component.
   */
  muiTheme: _react2.default.PropTypes.object.isRequired,

  /**
   * The css class name of the root element.
   */
  className: _react2.default.PropTypes.string,

  /**
   * The label contents.
   */
  children: _react2.default.PropTypes.node,

  /**
   * Disables the label if set to true.
   */
  disabled: _react2.default.PropTypes.bool,

  /**
   * True if the floating label should shrink.
   */
  shrink: _react2.default.PropTypes.bool,

  /**
   * The id of the target element that this label should refer to.
   */
  htmlFor: _react2.default.PropTypes.string,

  /**
   * Callback function for when the label is selected via a touch tap.
   */
  onTouchTap: _react2.default.PropTypes.func,

  /**
   * Override the inline-styles of the root element.
   */
  style: _react2.default.PropTypes.object
};

var defaultProps = {
  disabled: false,
  shrink: false
};

var TextFieldLabel = function TextFieldLabel(props) {
  var muiTheme = props.muiTheme;
  var className = props.className;
  var children = props.children;
  var disabled = props.disabled;
  var shrink = props.shrink;
  var htmlFor = props.htmlFor;
  var style = props.style;
  var onTouchTap = props.onTouchTap;

  var styles = {
    root: {
      position: 'absolute',
      lineHeight: '22px',
      top: 38,
      transition: _transitions2.default.easeOut(),
      zIndex: 1, // Needed to display label above Chrome's autocomplete field background
      cursor: disabled ? 'default' : 'text',
      transform: shrink ? 'perspective(1px) scale(0.75) translate3d(2px, -28px, 0)' : 'scale(1) translate3d(0, 0, 0)',
      transformOrigin: 'left top',
      pointerEvents: shrink ? 'none' : 'auto',
      userSelect: 'none'
    }
  };

  return _react2.default.createElement(
    'label',
    {
      className: className,
      style: (0, _styles.prepareStyles)(muiTheme, (0, _styles.mergeStyles)(styles.root, style)),
      htmlFor: htmlFor,
      onTouchTap: onTouchTap
    },
    children
  );
};

TextFieldLabel.propTypes = propTypes;
TextFieldLabel.defaultProps = defaultProps;

exports.default = TextFieldLabel;
module.exports = exports['default'];