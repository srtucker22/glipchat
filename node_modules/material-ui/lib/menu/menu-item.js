'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _fontIcon = require('../font-icon');

var _fontIcon2 = _interopRequireDefault(_fontIcon);

var _toggle = require('../toggle');

var _toggle2 = _interopRequireDefault(_toggle);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*eslint-disable */

var Types = {
  LINK: 'LINK',
  SUBHEADER: 'SUBHEADER',
  NESTED: 'NESTED'
};

var MenuItem = _react2.default.createClass({
  displayName: 'MenuItem',

  propTypes: {
    active: _react2.default.PropTypes.bool,
    attribute: _react2.default.PropTypes.string,
    children: _react2.default.PropTypes.node,
    className: _react2.default.PropTypes.string,
    data: _react2.default.PropTypes.string,
    disabled: _react2.default.PropTypes.bool,
    icon: _react2.default.PropTypes.node,
    iconClassName: _react2.default.PropTypes.string,
    iconRightClassName: _react2.default.PropTypes.string,
    iconRightStyle: _react2.default.PropTypes.object,
    iconStyle: _react2.default.PropTypes.object,
    index: _react2.default.PropTypes.number.isRequired,
    number: _react2.default.PropTypes.string,
    onMouseEnter: _react2.default.PropTypes.func,
    onMouseLeave: _react2.default.PropTypes.func,
    onToggle: _react2.default.PropTypes.func,
    onTouchTap: _react2.default.PropTypes.func,
    selected: _react2.default.PropTypes.bool,
    style: _react2.default.PropTypes.object,
    toggle: _react2.default.PropTypes.bool
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  statics: {
    Types: Types
  },

  getDefaultProps: function getDefaultProps() {
    return {
      toggle: false,
      disabled: false,
      active: false
    };
  },
  getInitialState: function getInitialState() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'This menu item component is deprecated use menus/menu-item instead.') : undefined;

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
    return this.state.muiTheme.menuItem;
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var _data;

    var isRtl = this.context.muiTheme.isRtl;

    var right = isRtl ? 'left' : 'right';
    var left = isRtl ? 'right' : 'left';

    var marginRight = isRtl ? 'marginLeft' : 'marginRight';
    var paddingLeft = isRtl ? 'paddingRight' : 'paddingLeft';

    var styles = {
      root: {
        userSelect: 'none',
        cursor: 'pointer',
        lineHeight: this.getTheme().height + 'px',
        paddingLeft: this.getTheme().padding,
        paddingRight: this.getTheme().padding,
        color: this.state.muiTheme.rawTheme.palette.textColor
      },
      number: {
        float: right,
        width: 24,
        textAlign: 'center'
      },
      attribute: {
        float: right
      },
      iconRight: {
        lineHeight: this.getTheme().height + 'px',
        float: right
      },
      icon: _defineProperty({
        float: left,
        lineHeight: this.getTheme().height + 'px'
      }, marginRight, this.getSpacing().desktopGutter),
      data: (_data = {
        display: 'block'
      }, _defineProperty(_data, paddingLeft, this.getSpacing().desktopGutter * 2), _defineProperty(_data, 'lineHeight', this.getTheme().dataHeight + 'px'), _defineProperty(_data, 'height', this.getTheme().dataHeight + 'px'), _defineProperty(_data, 'verticalAlign', 'top'), _defineProperty(_data, 'top', -12), _defineProperty(_data, 'position', 'relative'), _defineProperty(_data, 'fontWeight', 300), _defineProperty(_data, 'color', this.state.muiTheme.rawTheme.palette.textColor), _data),
      toggle: {
        marginTop: (this.getTheme().height - this.state.muiTheme.radioButton.size) / 2,
        float: right,
        width: 42
      },
      rootWhenHovered: {
        backgroundColor: this.getTheme().hoverColor
      },
      rootWhenSelected: {
        color: this.getTheme().selectedTextColor
      },
      rootWhenDisabled: {
        cursor: 'default',
        color: this.state.muiTheme.rawTheme.palette.disabledColor
      }
    };

    return styles;
  },
  _handleTouchTap: function _handleTouchTap(e) {
    if (!this.props.disabled && this.props.onTouchTap) this.props.onTouchTap(e, this.props.index);
  },
  _handleToggle: function _handleToggle(e, toggled) {
    if (!this.props.disabled && this.props.onToggle) this.props.onToggle(e, this.props.index, toggled);
  },
  _handleMouseEnter: function _handleMouseEnter(e) {
    if (!this.props.disabled && this.props.onMouseEnter) this.props.onMouseEnter(e, this.props.index);
  },
  _handleMouseLeave: function _handleMouseLeave(e) {
    if (!this.props.disabled && this.props.onMouseLeave) this.props.onMouseLeave(e, this.props.index);
  },
  render: function render() {
    var icon = undefined;
    var data = undefined;
    var iconRight = undefined;
    var attribute = undefined;
    var number = undefined;
    var toggleElement = undefined;
    var styles = this.getStyles();

    if (this.props.iconClassName) {
      icon = _react2.default.createElement(_fontIcon2.default, { style: this.mergeStyles(styles.icon, this.props.iconStyle, this.props.selected && styles.rootWhenSelected),
        className: this.props.iconClassName });
    }
    if (this.props.iconRightClassName) {
      iconRight = _react2.default.createElement(_fontIcon2.default, { style: this.mergeStyles(styles.iconRight, this.props.iconRightStyle),
        className: this.props.iconRightClassName });
    }
    if (this.props.data) data = _react2.default.createElement(
      'span',
      { style: this.prepareStyles(styles.data) },
      this.props.data
    );
    if (this.props.number !== undefined) {
      number = _react2.default.createElement(
        'span',
        { style: this.prepareStyles(styles.number) },
        this.props.number
      );
    }
    if (this.props.attribute !== undefined) {
      attribute = _react2.default.createElement(
        'span',
        { style: this.prepareStyles(styles.style) },
        this.props.attribute
      );
    }
    if (this.props.icon) icon = this.props.icon;

    if (this.props.toggle) {
      var _props = this.props;
      var toggle = _props.toggle;
      var onTouchTap = _props.onTouchTap;
      var onToggle = _props.onToggle;
      var onMouseEnter = _props.onMouseEnter;
      var onMouseLeave = _props.onMouseLeave;
      var children = _props.children;
      var style = _props.style;

      var other = _objectWithoutProperties(_props, ['toggle', 'onTouchTap', 'onToggle', 'onMouseEnter', 'onMouseLeave', 'children', 'style']);

      toggleElement = _react2.default.createElement(_toggle2.default, _extends({}, other, { onToggle: this._handleToggle, style: styles.toggle }));
    }

    return _react2.default.createElement(
      'div',
      {
        key: this.props.index,
        className: this.props.className,
        onTouchTap: this._handleTouchTap,
        onMouseEnter: this._handleMouseEnter,
        onMouseLeave: this._handleMouseLeave,
        style: this.prepareStyles(styles.root, this.props.selected && styles.rootWhenSelected, this.props.active && !this.props.disabled && styles.rootWhenHovered, this.props.style, this.props.disabled && styles.rootWhenDisabled) },
      icon,
      this.props.children,
      number,
      attribute,
      data,
      toggleElement,
      iconRight
    );
  }
});

exports.default = MenuItem;
module.exports = exports['default'];