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

var _paper = require('./paper');

var _paper2 = _interopRequireDefault(_paper);

var _enhancedSwitch = require('./enhanced-switch');

var _enhancedSwitch2 = _interopRequireDefault(_enhancedSwitch);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Toggle = _react2.default.createClass({
  displayName: 'Toggle',

  propTypes: {
    /**
     * Determines whether the Toggle is initially turned on.
     */
    defaultToggled: _react2.default.PropTypes.bool,

    /**
     * Will disable the toggle if true.
     */
    disabled: _react2.default.PropTypes.bool,

    /**
     * Overrides the inline-styles of the Toggle element.
     */
    elementStyle: _react2.default.PropTypes.object,

    /**
     * Overrides the inline-styles of the Icon element.
     */
    iconStyle: _react2.default.PropTypes.object,

    /**
     * Where the label will be placed next to the toggle.
     */
    labelPosition: _react2.default.PropTypes.oneOf(['left', 'right']),

    /**
     * Overrides the inline-styles of the Toggle element label.
     */
    labelStyle: _react2.default.PropTypes.object,

    /**
     * Callback function that is fired when the toggle switch is toggled.
     */
    onToggle: _react2.default.PropTypes.func,

    /**
     * Override style of ripple.
     */
    rippleStyle: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Override style for thumb.
     */
    thumbStyle: _react2.default.PropTypes.object,

    /**
     * Toggled if set to true.
     */
    toggled: _react2.default.PropTypes.bool,

    /**
     * Override style for track.
     */
    trackStyle: _react2.default.PropTypes.object,

    /**
     * ValueLink prop for when using controlled toggle.
     */
    valueLink: _react2.default.PropTypes.object
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
      defaultToggled: false,
      disabled: false,
      labelPosition: 'left'
    };
  },
  getInitialState: function getInitialState() {
    return {
      switched: this.props.toggled || this.props.defaultToggled || this.props.valueLink && this.props.valueLink.value || false,
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
    return this.state.muiTheme.toggle;
  },
  getStyles: function getStyles() {
    var toggleSize = 20;
    var toggleTrackWidth = 36;
    var styles = {
      icon: {
        width: 36,
        padding: '4px 0px 6px 2px'
      },
      toggleElement: {
        width: toggleTrackWidth
      },
      track: {
        transition: _transitions2.default.easeOut(),
        width: '100%',
        height: 14,
        borderRadius: 30,
        backgroundColor: this.getTheme().trackOffColor
      },
      thumb: {
        transition: _transitions2.default.easeOut(),
        position: 'absolute',
        top: 1,
        left: 0,
        width: toggleSize,
        height: toggleSize,
        lineHeight: '24px',
        borderRadius: '50%',
        backgroundColor: this.getTheme().thumbOffColor
      },
      trackWhenSwitched: {
        backgroundColor: this.getTheme().trackOnColor
      },
      thumbWhenSwitched: {
        backgroundColor: this.getTheme().thumbOnColor,
        left: '100%'
      },
      trackWhenDisabled: {
        backgroundColor: this.getTheme().trackDisabledColor
      },
      thumbWhenDisabled: {
        backgroundColor: this.getTheme().thumbDisabledColor
      },
      label: {
        color: this.props.disabled ? this.getTheme().labelDisabledColor : this.getTheme().labelColor,
        width: 'calc(100% - ' + (toggleTrackWidth + 10) + 'px)'
      }
    };

    return styles;
  },
  isToggled: function isToggled() {
    return this.refs.enhancedSwitch.isSwitched();
  },
  setToggled: function setToggled(newToggledValue) {
    this.refs.enhancedSwitch.setSwitched(newToggledValue);
  },
  _handleToggle: function _handleToggle(e, isInputChecked) {
    if (this.props.onToggle) this.props.onToggle(e, isInputChecked);
  },
  _handleStateChange: function _handleStateChange(newSwitched) {
    this.setState({ switched: newSwitched });
  },
  render: function render() {
    var _props = this.props;
    var onToggle = _props.onToggle;

    var other = _objectWithoutProperties(_props, ['onToggle']);

    var styles = this.getStyles();

    var trackStyles = this.mergeStyles(styles.track, this.props.trackStyle, this.state.switched && styles.trackWhenSwitched, this.props.disabled && styles.trackWhenDisabled);

    var thumbStyles = this.mergeStyles(styles.thumb, this.props.thumbStyle, this.state.switched && styles.thumbWhenSwitched, this.props.disabled && styles.thumbWhenDisabled);

    if (this.state.switched) {
      thumbStyles.marginLeft = '-' + thumbStyles.width;
    }

    var toggleElementStyles = this.mergeStyles(styles.toggleElement, this.props.elementStyle);

    var toggleElement = _react2.default.createElement(
      'div',
      { style: this.prepareStyles(toggleElementStyles) },
      _react2.default.createElement('div', { style: this.prepareStyles(trackStyles) }),
      _react2.default.createElement(_paper2.default, { style: thumbStyles, circle: true, zDepth: 1 })
    );

    var customRippleStyle = this.mergeStyles({
      top: -10,
      left: -10
    }, this.props.rippleStyle);

    var rippleColor = this.state.switched ? this.getTheme().thumbOnColor : this.state.muiTheme.textColor;

    var iconStyle = this.mergeStyles(styles.icon, this.props.iconStyle);

    var labelStyle = this.mergeStyles(styles.label, this.props.labelStyle);

    var enhancedSwitchProps = {
      ref: 'enhancedSwitch',
      inputType: 'checkbox',
      switchElement: toggleElement,
      rippleStyle: customRippleStyle,
      rippleColor: rippleColor,
      iconStyle: iconStyle,
      trackStyle: trackStyles,
      thumbStyle: thumbStyles,
      labelStyle: labelStyle,
      switched: this.state.switched,
      onSwitch: this._handleToggle,
      onParentShouldUpdate: this._handleStateChange,
      defaultSwitched: this.props.defaultToggled,
      labelPosition: this.props.labelPosition
    };

    if (this.props.hasOwnProperty('toggled')) enhancedSwitchProps.checked = this.props.toggled;

    return _react2.default.createElement(_enhancedSwitch2.default, _extends({}, other, enhancedSwitchProps));
  }
});

exports.default = Toggle;
module.exports = exports['default'];