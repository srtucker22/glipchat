'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _enhancedButton = require('../enhanced-button');

var _enhancedButton2 = _interopRequireDefault(_enhancedButton);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var YearButton = _react2.default.createClass({
  displayName: 'YearButton',

  propTypes: {
    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,
    onTouchTap: _react2.default.PropTypes.func,
    selected: _react2.default.PropTypes.bool,
    year: _react2.default.PropTypes.number
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
      selected: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      hover: false,
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
    return this.state.muiTheme.datePicker;
  },
  _handleMouseEnter: function _handleMouseEnter() {
    this.setState({ hover: true });
  },
  _handleMouseLeave: function _handleMouseLeave() {
    this.setState({ hover: false });
  },
  _handleTouchTap: function _handleTouchTap(e) {
    if (this.props.onTouchTap) this.props.onTouchTap(e, this.props.year);
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var year = _props.year;
    var onTouchTap = _props.onTouchTap;
    var selected = _props.selected;

    var other = _objectWithoutProperties(_props, ['className', 'year', 'onTouchTap', 'selected']);

    var styles = {
      root: {
        boxSizing: 'border-box',
        WebkitTapHighlightColor: 'rgba(0,0,0,0)',
        position: 'relative',
        display: 'block',
        margin: '0 auto',
        width: 36,
        fontSize: 14,
        padding: '8px 2px'
      },

      label: {
        position: 'relative',
        top: -1,
        color: this.state.muiTheme.rawTheme.palette.textColor
      },

      buttonState: {
        position: 'absolute',
        height: 32,
        width: 32,
        opacity: 0,
        borderRadius: '50%',
        transform: 'scale(0)',
        backgroundColor: this.getTheme().selectColor
      }
    };

    if (this.state.hover) {
      styles.label.color = this.getTheme().selectTextColor;
      styles.buttonState.opacity = 0.6;
      styles.buttonState.transform = 'scale(1.5)';
    }

    if (selected) {
      styles.label.color = this.getTheme().selectTextColor;
      styles.buttonState.opacity = 1;
      styles.buttonState.transform = 'scale(1.5)';
    }

    if (year === new Date().getFullYear()) {
      styles.root.color = this.getTheme().color;
    }

    return _react2.default.createElement(
      _enhancedButton2.default,
      _extends({}, other, {
        style: styles.root,
        disableFocusRipple: true,
        disableTouchRipple: true,
        onMouseEnter: this._handleMouseEnter,
        onMouseLeave: this._handleMouseLeave,
        onTouchTap: this._handleTouchTap
      }),
      _react2.default.createElement('div', { style: this.prepareStyles(styles.buttonState) }),
      _react2.default.createElement(
        'span',
        { style: this.prepareStyles(styles.label) },
        year
      )
    );
  }
});

exports.default = YearButton;
module.exports = exports['default'];