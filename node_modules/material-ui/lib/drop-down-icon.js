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

var _clickAwayable = require('./mixins/click-awayable');

var _clickAwayable2 = _interopRequireDefault(_clickAwayable);

var _fontIcon = require('./font-icon');

var _fontIcon2 = _interopRequireDefault(_fontIcon);

var _menu = require('./menu/menu');

var _menu2 = _interopRequireDefault(_menu);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DropDownIcon = _react2.default.createClass({
  displayName: 'DropDownIcon',

  propTypes: {
    children: _react2.default.PropTypes.node,
    closeOnMenuItemTouchTap: _react2.default.PropTypes.bool,
    iconClassName: _react2.default.PropTypes.string,
    iconLigature: _react2.default.PropTypes.string,
    iconStyle: _react2.default.PropTypes.object,
    menuItems: _react2.default.PropTypes.array.isRequired,
    onChange: _react2.default.PropTypes.func,

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

  mixins: [_stylePropable2.default, _clickAwayable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      closeOnMenuItemTouchTap: true
    };
  },
  getInitialState: function getInitialState() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'DropDownIcon has been deprecated and will be removed in an upcoming verion.' + ' Please use IconMenu instead.') : undefined;

    return {
      open: false,
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
  componentClickAway: function componentClickAway() {
    this.setState({ open: false });
  },
  getStyles: function getStyles() {
    var spacing = this.state.muiTheme.rawTheme.spacing;
    var iconWidth = 48;
    var styles = {
      root: {
        display: 'inline-block',
        width: iconWidth + 'px !important',
        position: 'relative',
        height: spacing.desktopToolbarHeight,
        fontSize: spacing.desktopDropDownMenuFontSize,
        cursor: 'pointer'
      },
      menu: {
        transition: _transitions2.default.easeOut(),
        right: '-14px !important',
        top: '9px !important',
        opacity: this.state.open ? 1 : 0
      },
      menuItem: { // similair to drop down menu's menu item styles
        paddingRight: spacing.iconSize + spacing.desktopGutterLess * 2,
        height: spacing.desktopDropDownMenuItemHeight,
        lineHeight: spacing.desktopDropDownMenuItemHeight + 'px'
      }
    };
    return styles;
  },
  _onControlClick: function _onControlClick() {
    this.setState({ open: !this.state.open });
  },
  _onMenuItemClick: function _onMenuItemClick(e, key, payload) {
    if (this.props.onChange) this.props.onChange(e, key, payload);

    if (this.props.closeOnMenuItemTouchTap) {
      this.setState({ open: false });
    }
  },
  render: function render() {
    var _props = this.props;
    var style = _props.style;
    var children = _props.children;
    var menuItems = _props.menuItems;
    var closeOnMenuItemTouchTap = _props.closeOnMenuItemTouchTap;
    var iconStyle = _props.iconStyle;
    var iconLigature = _props.iconLigature;
    var iconClassName = _props.iconClassName;

    var other = _objectWithoutProperties(_props, ['style', 'children', 'menuItems', 'closeOnMenuItemTouchTap', 'iconStyle', 'iconLigature', 'iconClassName']);

    var styles = this.getStyles();

    return _react2.default.createElement(
      'div',
      _extends({}, other, { style: this.prepareStyles(styles.root, style) }),
      _react2.default.createElement(
        'div',
        { onTouchTap: this._onControlClick },
        _react2.default.createElement(
          _fontIcon2.default,
          {
            className: iconClassName,
            style: iconStyle
          },
          iconLigature
        ),
        children
      ),
      _react2.default.createElement(_menu2.default, {
        ref: 'menuItems',
        style: styles.menu,
        menuItems: menuItems,
        menuItemStyle: styles.menuItem,
        hideable: true,
        visible: this.state.open,
        onItemTap: this._onMenuItemClick
      })
    );
  }
});

exports.default = DropDownIcon;
module.exports = exports['default'];