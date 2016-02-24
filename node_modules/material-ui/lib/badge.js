'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _typography = require('./styles/typography');

var _typography2 = _interopRequireDefault(_typography);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

// Badge
var Badge = _react2.default.createClass({
  displayName: 'Badge',

  propTypes: {
    /**
     * This is the content rendered within the badge.
     */
    badgeContent: _react2.default.PropTypes.node.isRequired,

    /**
     * Override the inline-styles of the badge element.
     */
    badgeStyle: _react2.default.PropTypes.object,

    /**
     * The badge will be added relativelty to this node.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * If true, the badge will use the primary badge colors.
     */
    primary: _react2.default.PropTypes.bool,

    /**
     * If true, the badge will use the secondary badge colors.
     */
    secondary: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
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
      primary: false,
      secondary: false
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
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme
    });
  },
  getStyles: function getStyles() {
    var theme = this.state.muiTheme.badge;

    var badgeBackgroundColor = this.props.primary ? theme.primaryColor : this.props.secondary ? theme.secondaryColor : theme.color;

    var badgeTextColor = this.props.primary ? theme.primaryTextColor : this.props.secondary ? theme.secondaryTextColor : theme.textColor;

    var radius = 12;
    var radius2x = Math.floor(2 * radius);

    return {
      root: {
        position: 'relative',
        display: 'inline-block',
        padding: [radius2x + 'px', radius2x + 'px', radius + 'px', radius + 'px'].join(' ')
      },
      badge: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        right: 0,
        fontWeight: _typography2.default.fontWeightMedium,
        fontSize: radius,
        width: radius2x,
        height: radius2x,
        borderRadius: '50%',
        backgroundColor: badgeBackgroundColor,
        color: badgeTextColor
      }
    };
  },
  render: function render() {
    var _props = this.props;
    var style = _props.style;
    var children = _props.children;
    var badgeContent = _props.badgeContent;
    var badgeStyle = _props.badgeStyle;

    var other = _objectWithoutProperties(_props, ['style', 'children', 'badgeContent', 'badgeStyle']);

    var styles = this.getStyles();

    return _react2.default.createElement(
      'div',
      _extends({}, other, { style: this.prepareStyles(styles.root, style) }),
      children,
      _react2.default.createElement(
        'span',
        { style: this.prepareStyles(styles.badge, badgeStyle) },
        badgeContent
      )
    );
  }
});

exports.default = Badge;
module.exports = exports['default'];