'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _colors = require('../styles/colors');

var _colors2 = _interopRequireDefault(_colors);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ToolbarGroup = _react2.default.createClass({
  displayName: 'ToolbarGroup',

  propTypes: {
    /**
     * Can be any node or number of nodes.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Set this to true for if the `ToolbarGroup` is the first child of `Toolbar`
     * to prevent setting the left gap.
     */
    firstChild: _react2.default.PropTypes.bool,

    /**
     * Determines the side the `ToolbarGroup` will snap to. Either 'left' or 'right'.
     */
    float: _react2.default.PropTypes.oneOf(['left', 'right']),

    /**
     * Set this to true for if the `ToolbarGroup` is the last child of `Toolbar`
     * to prevent setting the right gap.
     */
    lastChild: _react2.default.PropTypes.bool,

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
      firstChild: false,
      float: 'left',
      lastChild: false
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
    return this.state.muiTheme.toolbar;
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var _props = this.props;
    var firstChild = _props.firstChild;
    var float = _props.float;
    var lastChild = _props.lastChild;

    var marginHorizontal = this.getSpacing().desktopGutter;
    var marginVertical = (this.getTheme().height - this.state.muiTheme.button.height) / 2;
    var styles = {
      root: {
        float: float,
        position: 'relative',
        marginLeft: firstChild ? -marginHorizontal : undefined,
        marginRight: lastChild ? -marginHorizontal : undefined
      },
      dropDownMenu: {
        root: {
          float: 'left',
          color: _colors2.default.lightBlack, // removes hover color change, we want to keep it
          display: 'inline-block',
          marginRight: this.getSpacing().desktopGutter
        },
        controlBg: {
          backgroundColor: this.getTheme().menuHoverColor,
          borderRadius: 0
        },
        underline: {
          display: 'none'
        }
      },
      button: {
        float: 'left',
        margin: marginVertical + 'px ' + marginHorizontal + 'px',
        position: 'relative'
      },
      icon: {
        root: {
          float: 'left',
          cursor: 'pointer',
          color: this.getTheme().iconColor,
          lineHeight: this.getTheme().height + 'px',
          paddingLeft: this.getSpacing().desktopGutter
        },
        hover: {
          color: _colors2.default.darkBlack
        }
      },
      span: {
        float: 'left',
        color: this.getTheme().iconColor,
        lineHeight: this.getTheme().height + 'px'
      }
    };

    return styles;
  },
  _handleMouseEnterDropDownMenu: function _handleMouseEnterDropDownMenu(e) {
    e.target.style.zIndex = this.getStyles().icon.hover.zIndex;
    e.target.style.color = this.getStyles().icon.hover.color;
  },
  _handleMouseLeaveDropDownMenu: function _handleMouseLeaveDropDownMenu(e) {
    e.target.style.zIndex = 'auto';
    e.target.style.color = this.getStyles().icon.root.color;
  },
  _handleMouseEnterFontIcon: function _handleMouseEnterFontIcon(e) {
    e.target.style.zIndex = this.getStyles().icon.hover.zIndex;
    e.target.style.color = this.getStyles().icon.hover.color;
  },
  _handleMouseLeaveFontIcon: function _handleMouseLeaveFontIcon(e) {
    e.target.style.zIndex = 'auto';
    e.target.style.color = this.getStyles().icon.root.color;
  },
  render: function render() {
    var _this = this;

    var _props2 = this.props;
    var children = _props2.children;
    var className = _props2.className;
    var style = _props2.style;

    var other = _objectWithoutProperties(_props2, ['children', 'className', 'style']);

    var styles = this.getStyles();
    var newChildren = _react2.default.Children.map(children, function (currentChild) {
      if (!currentChild) {
        return null;
      }
      if (!currentChild.type) {
        return currentChild;
      }
      switch (currentChild.type.displayName) {
        case 'DropDownMenu':
          return _react2.default.cloneElement(currentChild, {
            style: _this.mergeStyles(styles.dropDownMenu.root, currentChild.props.style),
            styleControlBg: styles.dropDownMenu.controlBg,
            styleUnderline: styles.dropDownMenu.underline
          });
        case 'DropDownIcon':
          return _react2.default.cloneElement(currentChild, {
            style: _this.mergeStyles({ float: 'left' }, currentChild.props.style),
            iconStyle: styles.icon.root,
            onMouseEnter: _this._handleMouseEnterDropDownMenu,
            onMouseLeave: _this._handleMouseLeaveDropDownMenu
          });
        case 'RaisedButton':
        case 'FlatButton':
          return _react2.default.cloneElement(currentChild, {
            style: _this.mergeStyles(styles.button, currentChild.props.style)
          });
        case 'FontIcon':
          return _react2.default.cloneElement(currentChild, {
            style: _this.mergeStyles(styles.icon.root, currentChild.props.style),
            onMouseEnter: _this._handleMouseEnterFontIcon,
            onMouseLeave: _this._handleMouseLeaveFontIcon
          });
        case 'ToolbarSeparator':
        case 'ToolbarTitle':
          return _react2.default.cloneElement(currentChild, {
            style: _this.mergeStyles(styles.span, currentChild.props.style)
          });
        default:
          return currentChild;
      }
    }, this);

    return _react2.default.createElement(
      'div',
      _extends({}, other, { className: className, style: this.prepareStyles(styles.root, style) }),
      newChildren
    );
  }
});

exports.default = ToolbarGroup;
module.exports = exports['default'];