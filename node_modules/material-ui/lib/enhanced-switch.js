'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _keyCode = require('./utils/key-code');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _uniqueId = require('./utils/unique-id');

var _uniqueId2 = _interopRequireDefault(_uniqueId);

var _windowListenable = require('./mixins/window-listenable');

var _windowListenable2 = _interopRequireDefault(_windowListenable);

var _clearfix = require('./clearfix');

var _clearfix2 = _interopRequireDefault(_clearfix);

var _focusRipple = require('./ripples/focus-ripple');

var _focusRipple2 = _interopRequireDefault(_focusRipple);

var _touchRipple = require('./ripples/touch-ripple');

var _touchRipple2 = _interopRequireDefault(_touchRipple);

var _paper = require('./paper');

var _paper2 = _interopRequireDefault(_paper);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var EnhancedSwitch = _react2.default.createClass({
  displayName: 'EnhancedSwitch',

  propTypes: {
    checked: _react2.default.PropTypes.bool,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,
    defaultSwitched: _react2.default.PropTypes.bool,
    disableFocusRipple: _react2.default.PropTypes.bool,
    disableTouchRipple: _react2.default.PropTypes.bool,
    disabled: _react2.default.PropTypes.bool,
    iconStyle: _react2.default.PropTypes.object,
    id: _react2.default.PropTypes.string,
    inputType: _react2.default.PropTypes.string.isRequired,
    label: _react2.default.PropTypes.node,
    labelPosition: _react2.default.PropTypes.oneOf(['left', 'right']),
    labelStyle: _react2.default.PropTypes.object,
    name: _react2.default.PropTypes.string,
    onBlur: _react2.default.PropTypes.func,
    onFocus: _react2.default.PropTypes.func,
    onMouseDown: _react2.default.PropTypes.func,
    onMouseLeave: _react2.default.PropTypes.func,
    onMouseUp: _react2.default.PropTypes.func,
    onParentShouldUpdate: _react2.default.PropTypes.func.isRequired,
    onSwitch: _react2.default.PropTypes.func,
    onTouchEnd: _react2.default.PropTypes.func,
    onTouchStart: _react2.default.PropTypes.func,
    required: _react2.default.PropTypes.bool,
    rippleColor: _react2.default.PropTypes.string,
    rippleStyle: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,
    switchElement: _react2.default.PropTypes.element.isRequired,
    switched: _react2.default.PropTypes.bool.isRequired,
    thumbStyle: _react2.default.PropTypes.object,
    trackStyle: _react2.default.PropTypes.object,
    value: _react2.default.PropTypes.string
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_windowListenable2.default, _stylePropable2.default],

  getInitialState: function getInitialState() {
    return {
      isKeyboardFocused: false,
      parentWidth: 100,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    var inputNode = _reactDom2.default.findDOMNode(this.refs.checkbox);
    if (!this.props.switched || inputNode.checked !== this.props.switched) {
      this.props.onParentShouldUpdate(inputNode.checked);
    }

    window.addEventListener('resize', this._handleResize);

    this._handleResize();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var hasCheckedLinkProp = nextProps.hasOwnProperty('checkedLink');
    var hasCheckedProp = nextProps.hasOwnProperty('checked');
    var hasToggledProp = nextProps.hasOwnProperty('toggled');
    var hasNewDefaultProp = nextProps.hasOwnProperty('defaultSwitched') && nextProps.defaultSwitched !== this.props.defaultSwitched;
    var newState = {};
    newState.muiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    if (hasCheckedProp) {
      newState.switched = nextProps.checked;
    } else if (hasToggledProp) {
      newState.switched = nextProps.toggled;
    } else if (hasCheckedLinkProp) {
      newState.switched = nextProps.checkedLink.value;
    } else if (hasNewDefaultProp) {
      newState.switched = nextProps.defaultSwitched;
    }

    if (newState.switched !== undefined && newState.switched !== this.props.switched) {
      this.props.onParentShouldUpdate(newState.switched);
    }

    this.setState(newState);
  },
  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  },

  windowListeners: {
    keydown: '_handleWindowKeydown',
    keyup: '_handleWindowKeyup'
  },

  getEvenWidth: function getEvenWidth() {
    return parseInt(window.getComputedStyle(_reactDom2.default.findDOMNode(this.refs.root)).getPropertyValue('width'), 10);
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.rawTheme.palette;
  },
  getStyles: function getStyles() {
    var spacing = this.state.muiTheme.rawTheme.spacing;
    var switchWidth = 60 - spacing.desktopGutterLess;
    var labelWidth = 'calc(100% - 60px)';
    var styles = {
      root: {
        position: 'relative',
        cursor: this.props.disabled ? 'default' : 'pointer',
        overflow: 'visible',
        display: 'table',
        height: 'auto',
        width: '100%'
      },
      input: {
        position: 'absolute',
        cursor: this.props.disabled ? 'default' : 'pointer',
        pointerEvents: 'all',
        opacity: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
        left: 0,
        boxSizing: 'border-box',
        padding: 0,
        margin: 0
      },
      controls: {
        width: '100%',
        height: '100%'
      },
      label: {
        float: 'left',
        position: 'relative',
        display: 'block',
        width: labelWidth,
        lineHeight: '24px',
        color: this.getTheme().textColor,
        fontFamily: this.state.muiTheme.rawTheme.fontFamily
      },
      wrap: {
        transition: _transitions2.default.easeOut(),
        float: 'left',
        position: 'relative',
        display: 'block',
        width: switchWidth,
        marginRight: this.props.labelPosition === 'right' ? spacing.desktopGutterLess : 0,
        marginLeft: this.props.labelPosition === 'left' ? spacing.desktopGutterLess : 0
      },
      ripple: {
        height: '200%',
        width: '200%',
        top: -12,
        left: -12
      }
    };

    return styles;
  },
  isSwitched: function isSwitched() {
    return _reactDom2.default.findDOMNode(this.refs.checkbox).checked;
  },

  // no callback here because there is no event
  setSwitched: function setSwitched(newSwitchedValue) {
    if (!this.props.hasOwnProperty('checked') || this.props.checked === false) {
      this.props.onParentShouldUpdate(newSwitchedValue);
      _reactDom2.default.findDOMNode(this.refs.checkbox).checked = newSwitchedValue;
    } else {
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'Cannot call set method while checked is defined as a property.') : undefined;
    }
  },
  getValue: function getValue() {
    return _reactDom2.default.findDOMNode(this.refs.checkbox).value;
  },
  isKeyboardFocused: function isKeyboardFocused() {
    return this.state.isKeyboardFocused;
  },
  _handleChange: function _handleChange(e) {
    this._tabPressed = false;
    this.setState({
      isKeyboardFocused: false
    });

    var isInputChecked = _reactDom2.default.findDOMNode(this.refs.checkbox).checked;

    if (!this.props.hasOwnProperty('checked')) {
      this.props.onParentShouldUpdate(isInputChecked);
    }
    if (this.props.onSwitch) {
      this.props.onSwitch(e, isInputChecked);
    }
  },

  // Checkbox inputs only use SPACE to change their state. Using ENTER will
  // update the ui but not the input.
  _handleWindowKeydown: function _handleWindowKeydown(e) {
    if (e.keyCode === _keyCode2.default.TAB) {
      this._tabPressed = true;
    }
    if (e.keyCode === _keyCode2.default.SPACE && this.state.isKeyboardFocused) {
      this._handleChange(e);
    }
  },
  _handleWindowKeyup: function _handleWindowKeyup(e) {
    if (e.keyCode === _keyCode2.default.SPACE && this.state.isKeyboardFocused) {
      this._handleChange(e);
    }
  },

  /**
   * Because both the ripples and the checkbox input cannot share pointer
   * events, the checkbox input takes control of pointer events and calls
   * ripple animations manually.
   */
  _handleMouseDown: function _handleMouseDown(e) {
    //only listen to left clicks
    if (e.button === 0) {
      this.refs.touchRipple.start(e);
    }
  },
  _handleMouseUp: function _handleMouseUp() {
    this.refs.touchRipple.end();
  },
  _handleMouseLeave: function _handleMouseLeave() {
    this.refs.touchRipple.end();
  },
  _handleTouchStart: function _handleTouchStart(e) {
    this.refs.touchRipple.start(e);
  },
  _handleTouchEnd: function _handleTouchEnd() {
    this.refs.touchRipple.end();
  },
  _handleBlur: function _handleBlur(e) {
    this.setState({
      isKeyboardFocused: false
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  },
  _handleFocus: function _handleFocus(e) {
    var _this = this;

    //setTimeout is needed becuase the focus event fires first
    //Wait so that we can capture if this was a keyboard focus
    //or touch focus
    setTimeout(function () {
      if (_this._tabPressed) {
        _this.setState({
          isKeyboardFocused: true
        });
      }
    }, 150);

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  },
  _handleResize: function _handleResize() {
    this.setState({ parentWidth: this.getEvenWidth() });
  },
  render: function render() {
    var _props = this.props;
    var name = _props.name;
    var value = _props.value;
    var label = _props.label;
    var onSwitch = _props.onSwitch;
    var defaultSwitched = _props.defaultSwitched;
    var onBlur = _props.onBlur;
    var onFocus = _props.onFocus;
    var onMouseUp = _props.onMouseUp;
    var onMouseDown = _props.onMouseDown;
    var onMouseLeave = _props.onMouseLeave;
    var onTouchStart = _props.onTouchStart;
    var onTouchEnd = _props.onTouchEnd;
    var disableTouchRipple = _props.disableTouchRipple;
    var disableFocusRipple = _props.disableFocusRipple;
    var className = _props.className;

    var other = _objectWithoutProperties(_props, ['name', 'value', 'label', 'onSwitch', 'defaultSwitched', 'onBlur', 'onFocus', 'onMouseUp', 'onMouseDown', 'onMouseLeave', 'onTouchStart', 'onTouchEnd', 'disableTouchRipple', 'disableFocusRipple', 'className']);

    var styles = this.getStyles();
    var wrapStyles = this.mergeStyles(styles.wrap, this.props.iconStyle);
    var rippleStyle = this.mergeStyles(styles.ripple, this.props.rippleStyle);
    var rippleColor = this.props.hasOwnProperty('rippleColor') ? this.props.rippleColor : this.getTheme().primary1Color;

    if (this.props.thumbStyle) {
      wrapStyles.marginLeft /= 2;
      wrapStyles.marginRight /= 2;
    }

    var inputId = this.props.id || _uniqueId2.default.generate();

    var labelStyle = this.mergeStyles(styles.label, this.props.labelStyle);
    var labelElement = this.props.label ? _react2.default.createElement(
      'label',
      { style: this.prepareStyles(labelStyle), htmlFor: inputId },
      this.props.label
    ) : null;

    var inputProps = {
      ref: 'checkbox',
      type: this.props.inputType,
      style: this.prepareStyles(styles.input),
      name: this.props.name,
      value: this.props.value,
      defaultChecked: this.props.defaultSwitched,
      onBlur: this._handleBlur,
      onFocus: this._handleFocus
    };

    var hideTouchRipple = this.props.disabled || disableTouchRipple;

    if (!hideTouchRipple) {
      inputProps.onMouseUp = this._handleMouseUp;
      inputProps.onMouseDown = this._handleMouseDown;
      inputProps.onMouseLeave = this._handleMouseLeave;
      inputProps.onTouchStart = this._handleTouchStart;
      inputProps.onTouchEnd = this._handleTouchEnd;
    }

    if (!this.props.hasOwnProperty('checkedLink')) {
      inputProps.onChange = this._handleChange;
    }

    var inputElement = _react2.default.createElement('input', _extends({}, other, inputProps));

    var touchRipple = _react2.default.createElement(_touchRipple2.default, {
      ref: 'touchRipple',
      key: 'touchRipple',
      style: rippleStyle,
      color: rippleColor,
      muiTheme: this.state.muiTheme,
      centerRipple: true
    });

    var focusRipple = _react2.default.createElement(_focusRipple2.default, {
      key: 'focusRipple',
      innerStyle: rippleStyle,
      color: rippleColor,
      muiTheme: this.state.muiTheme,
      show: this.state.isKeyboardFocused
    });

    var ripples = [hideTouchRipple ? null : touchRipple, this.props.disabled || disableFocusRipple ? null : focusRipple];

    // If toggle component (indicated by whether the style includes thumb) manually lay out
    // elements in order to nest ripple elements
    var switchElement = !this.props.thumbStyle ? _react2.default.createElement(
      'div',
      { style: this.prepareStyles(wrapStyles) },
      this.props.switchElement,
      ripples
    ) : _react2.default.createElement(
      'div',
      { style: this.prepareStyles(wrapStyles) },
      _react2.default.createElement('div', { style: this.prepareStyles(this.props.trackStyle) }),
      _react2.default.createElement(
        _paper2.default,
        { style: this.props.thumbStyle, zDepth: 1, circle: true },
        ' ',
        ripples,
        ' '
      )
    );

    var labelPositionExist = this.props.labelPosition;

    // Position is left if not defined or invalid.
    var elementsInOrder = labelPositionExist && this.props.labelPosition.toUpperCase() === 'RIGHT' ? _react2.default.createElement(
      _clearfix2.default,
      { style: styles.controls },
      switchElement,
      labelElement
    ) : _react2.default.createElement(
      _clearfix2.default,
      { style: styles.controls },
      labelElement,
      switchElement
    );

    return _react2.default.createElement(
      'div',
      { ref: 'root', className: className, style: this.prepareStyles(styles.root, this.props.style) },
      inputElement,
      elementsInOrder
    );
  }
});

exports.default = EnhancedSwitch;
module.exports = exports['default'];