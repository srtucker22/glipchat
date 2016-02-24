'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _colorManipulator = require('../utils/color-manipulator');

var _colorManipulator2 = _interopRequireDefault(_colorManipulator);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _uniqueId = require('../utils/unique-id');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _enhancedTextarea = require('../enhanced-textarea');

var _enhancedTextarea2 = _interopRequireDefault(_enhancedTextarea);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _contextPure = require('../mixins/context-pure');

var _contextPure2 = _interopRequireDefault(_contextPure);

var _TextFieldHint = require('./TextFieldHint');

var _TextFieldHint2 = _interopRequireDefault(_TextFieldHint);

var _TextFieldLabel = require('./TextFieldLabel');

var _TextFieldLabel2 = _interopRequireDefault(_TextFieldLabel);

var _TextFieldUnderline = require('./TextFieldUnderline');

var _TextFieldUnderline2 = _interopRequireDefault(_TextFieldUnderline);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * Check if a value is valid to be displayed inside an input.
 *
 * @param The value to check.
 * @returns True if the string provided is valid, false otherwise.
 */
function isValid(value) {
  return Boolean(value || value === 0);
}

var TextField = _react2.default.createClass({
  displayName: 'TextField',

  propTypes: {
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * The text string to use for the default value.
     */
    defaultValue: _react2.default.PropTypes.any,

    /**
     * Disables the text field if set to true.
     */
    disabled: _react2.default.PropTypes.bool,

    /**
     * The style object to use to override error styles.
     */
    errorStyle: _react2.default.PropTypes.object,

    /**
     * The error content to display.
     */
    errorText: _react2.default.PropTypes.node,

    /**
     * The style object to use to override floating label styles.
     */
    floatingLabelStyle: _react2.default.PropTypes.object,

    /**
     * The content to use for the floating label element.
     */
    floatingLabelText: _react2.default.PropTypes.node,

    /**
     * If true, the field receives the property width 100%.
     */
    fullWidth: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the TextField's hint text element.
     */
    hintStyle: _react2.default.PropTypes.object,

    /**
     * The hint content to display.
     */
    hintText: _react2.default.PropTypes.node,

    /**
     * The id prop for the text field.
     */
    id: _react2.default.PropTypes.string,

    /**
     * Override the inline-styles of the TextField's input element.
     */
    inputStyle: _react2.default.PropTypes.object,

    /**
     * If true, a textarea element will be rendered.
     * The textarea also grows and shrinks according to the number of lines.
     */
    multiLine: _react2.default.PropTypes.bool,

    /**
     * Callback function that is fired when the textfield loses focus.
     */
    onBlur: _react2.default.PropTypes.func,

    /**
     * Callback function that is fired when the textfield's value changes.
     */
    onChange: _react2.default.PropTypes.func,

    /**
     * The function to call when the user presses the Enter key.
     */
    onEnterKeyDown: _react2.default.PropTypes.func,

    /**
     * Callback function that is fired when the textfield gains focus.
     */
    onFocus: _react2.default.PropTypes.func,

    /**
     * Callback function fired when key is pressed down.
     */
    onKeyDown: _react2.default.PropTypes.func,

    /**
     * Number of rows to display when multiLine option is set to true.
     */
    rows: _react2.default.PropTypes.number,

    /**
     * Maximum number of rows to display when
     * multiLine option is set to true.
     */
    rowsMax: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Specifies the type of input to display
     * such as "password" or "text".
     */
    type: _react2.default.PropTypes.string,

    /**
     * Override the inline-styles of the
     * TextField's underline element when disabled.
     */
    underlineDisabledStyle: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the TextField's
     * underline element when focussed.
     */
    underlineFocusStyle: _react2.default.PropTypes.object,

    /**
     * If true, shows the underline for the text field.
     */
    underlineShow: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the TextField's underline element.
     */
    underlineStyle: _react2.default.PropTypes.object,

    /**
     * The value of the text field.
     */
    value: _react2.default.PropTypes.any
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_contextPure2.default, _stylePropable2.default],

  statics: {
    getRelevantContextKeys: function getRelevantContextKeys(muiTheme) {
      var textFieldTheme = muiTheme.textField;

      return {
        floatingLabelColor: textFieldTheme.floatingLabelColor,
        focusColor: textFieldTheme.focusColor,
        textColor: textFieldTheme.textColor,
        disabledTextColor: textFieldTheme.disabledTextColor,
        backgroundColor: textFieldTheme.backgroundColor,
        hintColor: textFieldTheme.hintColor,
        errorColor: textFieldTheme.errorColor
      };
    },
    getChildrenClasses: function getChildrenClasses() {
      return [_enhancedTextarea2.default];
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false,
      multiLine: false,
      fullWidth: false,
      type: 'text',
      underlineShow: true,
      rows: 1
    };
  },
  getInitialState: function getInitialState() {
    var props = this.props.children ? this.props.children.props : this.props;

    return {
      isFocused: false,
      errorText: this.props.errorText,
      hasValue: isValid(props.value) || isValid(props.defaultValue) || props.valueLink && isValid(props.valueLink.value),
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this._uniqueId = _uniqueId2.default.generate();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newState = {};
    newState.muiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    newState.errorText = nextProps.errorText;
    if (nextProps.children && nextProps.children.props) {
      nextProps = nextProps.children.props;
    }

    var hasValueLinkProp = nextProps.hasOwnProperty('valueLink');
    var hasValueProp = nextProps.hasOwnProperty('value');
    var hasNewDefaultValue = nextProps.defaultValue !== this.props.defaultValue;

    if (hasValueLinkProp) {
      newState.hasValue = isValid(nextProps.valueLink.value);
    } else if (hasValueProp) {
      newState.hasValue = isValid(nextProps.value);
    } else if (hasNewDefaultValue) {
      newState.hasValue = isValid(nextProps.defaultValue);
    }

    if (newState) this.setState(newState);
  },
  getStyles: function getStyles() {
    var props = this.props;

    var _constructor$getRelev = this.constructor.getRelevantContextKeys(this.state.muiTheme);

    var floatingLabelColor = _constructor$getRelev.floatingLabelColor;
    var focusColor = _constructor$getRelev.focusColor;
    var textColor = _constructor$getRelev.textColor;
    var disabledTextColor = _constructor$getRelev.disabledTextColor;
    var backgroundColor = _constructor$getRelev.backgroundColor;
    var hintColor = _constructor$getRelev.hintColor;
    var errorColor = _constructor$getRelev.errorColor;

    var styles = {
      root: {
        fontSize: 16,
        lineHeight: '24px',
        width: props.fullWidth ? '100%' : 256,
        height: (props.rows - 1) * 24 + (props.floatingLabelText ? 72 : 48),
        display: 'inline-block',
        position: 'relative',
        backgroundColor: backgroundColor,
        fontFamily: this.state.muiTheme.rawTheme.fontFamily,
        transition: _transitions2.default.easeOut('200ms', 'height')
      },
      error: {
        position: 'relative',
        bottom: 2,
        fontSize: 12,
        lineHeight: '12px',
        color: errorColor,
        transition: _transitions2.default.easeOut()
      },
      floatingLabel: {
        color: hintColor
      },
      input: {
        tapHighlightColor: 'rgba(0,0,0,0)',
        padding: 0,
        position: 'relative',
        width: '100%',
        height: '100%',
        border: 'none',
        outline: 'none',
        backgroundColor: 'transparent',
        color: props.disabled ? disabledTextColor : textColor,
        font: 'inherit'
      }
    };

    styles.error = this.mergeStyles(styles.error, props.errorStyle);

    styles.textarea = this.mergeStyles(styles.input, {
      marginTop: props.floatingLabelText ? 36 : 12,
      marginBottom: props.floatingLabelText ? -36 : -12,
      boxSizing: 'border-box',
      font: 'inherit'
    });

    if (this.state.isFocused) {
      styles.floatingLabel.color = focusColor;
    }

    if (this.state.hasValue) {
      styles.floatingLabel.color = _colorManipulator2.default.fade(props.disabled ? disabledTextColor : floatingLabelColor, 0.5);
    }

    if (props.floatingLabelText) {
      styles.input.boxSizing = 'border-box';

      if (!props.multiLine) {
        styles.input.marginTop = 14;
      }

      if (this.state.errorText) {
        styles.error.bottom = !props.multiLine ? styles.error.fontSize + 3 : 3;
      }
    }

    if (this.state.errorText) {
      if (this.state.isFocused) {
        styles.floatingLabel.color = styles.error.color;
      }
    }

    return styles;
  },
  blur: function blur() {
    if (this.isMounted()) this._getInputNode().blur();
  },
  clearValue: function clearValue() {
    this.setValue('');
  },
  focus: function focus() {
    if (this.isMounted()) this._getInputNode().focus();
  },
  getValue: function getValue() {
    return this.isMounted() ? this._getInputNode().value : undefined;
  },
  setErrorText: function setErrorText(newErrorText) {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'setErrorText() method is deprecated. Use the errorText property instead.') : undefined;

    if (this.isMounted()) {
      this.setState({ errorText: newErrorText });
    }
  },
  setValue: function setValue(newValue) {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'setValue() method is deprecated. Use the defaultValue property instead.\n      Or use the TextField as a controlled component with the value property.') : undefined;

    if (this.isMounted()) {
      if (this.props.multiLine) {
        this.refs.input.setValue(newValue);
      } else {
        this._getInputNode().value = newValue;
      }

      this.setState({ hasValue: isValid(newValue) });
    }
  },
  _getInputNode: function _getInputNode() {
    return this.props.children || this.props.multiLine ? this.refs.input.getInputNode() : _reactDom2.default.findDOMNode(this.refs.input);
  },
  _handleInputBlur: function _handleInputBlur(e) {
    this.setState({ isFocused: false });
    if (this.props.onBlur) this.props.onBlur(e);
  },
  _handleInputChange: function _handleInputChange(e) {
    this.setState({ hasValue: isValid(e.target.value) });
    if (this.props.onChange) this.props.onChange(e);
  },
  _handleInputFocus: function _handleInputFocus(e) {
    if (this.props.disabled) return;
    this.setState({ isFocused: true });
    if (this.props.onFocus) this.props.onFocus(e);
  },
  _handleInputKeyDown: function _handleInputKeyDown(e) {
    if (e.keyCode === 13 && this.props.onEnterKeyDown) this.props.onEnterKeyDown(e);
    if (this.props.onKeyDown) this.props.onKeyDown(e);
  },
  _handleTextAreaHeightChange: function _handleTextAreaHeightChange(e, height) {
    var newHeight = height + 24;
    if (this.props.floatingLabelText) newHeight += 24;
    _reactDom2.default.findDOMNode(this).style.height = newHeight + 'px';
  },
  _isControlled: function _isControlled() {
    return this.props.hasOwnProperty('value') || this.props.hasOwnProperty('valueLink');
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var disabled = _props.disabled;
    var errorStyle = _props.errorStyle;
    var errorText = _props.errorText;
    var floatingLabelText = _props.floatingLabelText;
    var fullWidth = _props.fullWidth;
    var hintText = _props.hintText;
    var hintStyle = _props.hintStyle;
    var id = _props.id;
    var multiLine = _props.multiLine;
    var onBlur = _props.onBlur;
    var onChange = _props.onChange;
    var onFocus = _props.onFocus;
    var style = _props.style;
    var type = _props.type;
    var underlineDisabledStyle = _props.underlineDisabledStyle;
    var underlineFocusStyle = _props.underlineFocusStyle;
    var underlineShow = _props.underlineShow;
    var underlineStyle = _props.underlineStyle;
    var rows = _props.rows;
    var rowsMax = _props.rowsMax;

    var other = _objectWithoutProperties(_props, ['className', 'disabled', 'errorStyle', 'errorText', 'floatingLabelText', 'fullWidth', 'hintText', 'hintStyle', 'id', 'multiLine', 'onBlur', 'onChange', 'onFocus', 'style', 'type', 'underlineDisabledStyle', 'underlineFocusStyle', 'underlineShow', 'underlineStyle', 'rows', 'rowsMax']);

    var styles = this.getStyles();

    var inputId = id || this._uniqueId;

    var errorTextElement = this.state.errorText ? _react2.default.createElement(
      'div',
      { style: this.prepareStyles(styles.error) },
      this.state.errorText
    ) : null;

    var floatingLabelTextElement = floatingLabelText ? _react2.default.createElement(
      _TextFieldLabel2.default,
      {
        muiTheme: this.state.muiTheme,
        style: this.mergeStyles(styles.floatingLabel, this.props.floatingLabelStyle),
        htmlFor: inputId,
        shrink: this.state.hasValue || this.state.isFocused,
        disabled: disabled,
        onTouchTap: this.focus
      },
      floatingLabelText
    ) : null;

    var inputProps = undefined;
    var inputElement = undefined;

    inputProps = {
      id: inputId,
      ref: 'input',
      onBlur: this._handleInputBlur,
      onFocus: this._handleInputFocus,
      disabled: this.props.disabled,
      onKeyDown: this._handleInputKeyDown
    };
    var inputStyle = this.mergeStyles(styles.input, this.props.inputStyle);

    if (!this.props.hasOwnProperty('valueLink')) {
      inputProps.onChange = this._handleInputChange;
    }

    if (this.props.children) {
      inputElement = _react2.default.cloneElement(this.props.children, _extends({}, inputProps, this.props.children.props, {
        style: this.mergeStyles(inputStyle, this.props.children.props.style)
      }));
    } else {
      inputElement = multiLine ? _react2.default.createElement(_enhancedTextarea2.default, _extends({}, other, inputProps, {
        style: inputStyle,
        rows: rows,
        rowsMax: rowsMax,
        onHeightChange: this._handleTextAreaHeightChange,
        textareaStyle: styles.textarea
      })) : _react2.default.createElement('input', _extends({}, other, inputProps, {
        style: this.prepareStyles(inputStyle),
        type: type
      }));
    }

    return _react2.default.createElement(
      'div',
      { className: className, style: this.prepareStyles(styles.root, this.props.style) },
      floatingLabelTextElement,
      hintText ? _react2.default.createElement(_TextFieldHint2.default, {
        muiTheme: this.state.muiTheme,
        show: !(this.state.hasValue || floatingLabelText && !this.state.isFocused),
        style: hintStyle,
        text: hintText
      }) : null,
      inputElement,
      underlineShow ? _react2.default.createElement(_TextFieldUnderline2.default, {
        disabled: disabled,
        disabledStyle: underlineDisabledStyle,
        error: this.state.errorText ? true : false,
        errorStyle: errorStyle,
        focus: this.state.isFocused,
        focusStyle: underlineFocusStyle,
        muiTheme: this.state.muiTheme,
        style: underlineStyle
      }) : null,
      errorTextElement
    );
  }
});

exports.default = TextField;
module.exports = exports['default'];