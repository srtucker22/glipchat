'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _enhancedSwitch = require('./enhanced-switch');

var _enhancedSwitch2 = _interopRequireDefault(_enhancedSwitch);

var _radioButtonUnchecked = require('./svg-icons/toggle/radio-button-unchecked');

var _radioButtonUnchecked2 = _interopRequireDefault(_radioButtonUnchecked);

var _radioButtonChecked = require('./svg-icons/toggle/radio-button-checked');

var _radioButtonChecked2 = _interopRequireDefault(_radioButtonChecked);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var RadioButton = _react2.default.createClass({
  displayName: 'RadioButton',

  propTypes: {
    /**
     * Used internally by `RadioButtonGroup`.
     */
    /* Checked if true. */
    checked: _react2.default.PropTypes.bool,

    /**
     * Disabled if true.
     */
    disabled: _react2.default.PropTypes.bool,

    /**
     * Overrides the inline-styles of the icon element.
     */
    iconStyle: _react2.default.PropTypes.object,

    /**
     * Used internally by `RadioButtonGroup`. Use the `labelPosition` property of `RadioButtonGroup` instead.
     */
    /* Where the label will be placed next to the radio button. */
    labelPosition: _react2.default.PropTypes.oneOf(['left', 'right']),

    /**
     * Overrides the inline-styles of the RadioButton element label.
     */
    labelStyle: _react2.default.PropTypes.object,

    /**
     * Callback function for checked event.
     */
    onCheck: _react2.default.PropTypes.func,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The value of our radio button component.
     */
    value: _react2.default.PropTypes.string
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      checked: false,
      disabled: false,
      labelPosition: 'right'
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.radioButton;
  },
  getStyles: function getStyles() {
    var styles = {
      icon: {
        height: this.getTheme().size,
        width: this.getTheme().size
      },
      target: {
        transition: _transitions2.default.easeOut(),
        position: 'absolute',
        opacity: 1,
        transform: 'scale(1)',
        fill: this.getTheme().borderColor
      },
      fill: {
        position: 'absolute',
        opacity: 1,
        transform: 'scale(0)',
        transformOrigin: '50% 50%',
        transition: _transitions2.default.easeOut(),
        fill: this.getTheme().checkedColor
      },
      targetWhenChecked: {
        opacity: 0,
        transform: 'scale(0)'
      },
      fillWhenChecked: {
        opacity: 1,
        transform: 'scale(1)'
      },
      targetWhenDisabled: {
        fill: this.getTheme().disabledColor
      },
      fillWhenDisabled: {
        fill: this.getTheme().disabledColor
      },
      label: {
        color: this.props.disabled ? this.getTheme().labelDisabledColor : this.getTheme().labelColor
      }
    };

    return styles;
  },

  // Only called when selected, not when unselected.
  _handleCheck: function _handleCheck(e) {
    if (this.props.onCheck) this.props.onCheck(e, this.props.value);
  },
  _handleStateChange: function _handleStateChange() {},
  isChecked: function isChecked() {
    return this.refs.enhancedSwitch.isSwitched();
  },

  // Use RadioButtonGroup.setSelectedValue(newSelectionValue) to set a
  // RadioButton's checked value.
  setChecked: function setChecked(newCheckedValue) {
    this.refs.enhancedSwitch.setSwitched(newCheckedValue);
  },
  getValue: function getValue() {
    return this.refs.enhancedSwitch.getValue();
  },
  render: function render() {
    var _props = this.props;
    var onCheck = _props.onCheck;

    var other = _objectWithoutProperties(_props, ['onCheck']);

    var styles = this.getStyles();
    var onStyles = this.mergeStyles(styles.target, this.props.checked && styles.targetWhenChecked, this.props.iconStyle, this.props.disabled && styles.targetWhenDisabled);
    var offStyles = this.mergeStyles(styles.fill, this.props.checked && styles.fillWhenChecked, this.props.iconStyle, this.props.disabled && styles.fillWhenDisabled);

    var radioButtonElement = _react2.default.createElement(
      'div',
      null,
      _react2.default.createElement(_radioButtonUnchecked2.default, { style: onStyles }),
      _react2.default.createElement(_radioButtonChecked2.default, { style: offStyles })
    );

    var rippleColor = this.props.checked ? this.getTheme().checkedColor : this.getTheme().borderColor;

    var iconStyle = this.mergeStyles(styles.icon, this.props.iconStyle);

    var labelStyle = this.mergeStyles(styles.label, this.props.labelStyle);

    var enhancedSwitchProps = {
      ref: 'enhancedSwitch',
      inputType: 'radio',
      switched: this.props.checked,
      switchElement: radioButtonElement,
      rippleColor: rippleColor,
      iconStyle: iconStyle,
      labelStyle: labelStyle,
      onSwitch: this._handleCheck,
      onParentShouldUpdate: this._handleStateChange,
      labelPosition: this.props.labelPosition
    };

    return _react2.default.createElement(_enhancedSwitch2.default, _extends({}, other, enhancedSwitchProps));
  }
});

exports.default = RadioButton;
module.exports = exports['default'];