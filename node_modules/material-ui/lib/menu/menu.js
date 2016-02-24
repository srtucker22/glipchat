'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _cssEvent = require('../utils/css-event');

var _cssEvent2 = _interopRequireDefault(_cssEvent);

var _keyLine = require('../utils/key-line');

var _keyLine2 = _interopRequireDefault(_keyLine);

var _keyCode = require('../utils/key-code');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _clickAwayable = require('../mixins/click-awayable');

var _clickAwayable2 = _interopRequireDefault(_clickAwayable);

var _paper = require('../paper');

var _paper2 = _interopRequireDefault(_paper);

var _menuItem2 = require('./menu-item');

var _menuItem3 = _interopRequireDefault(_menuItem2);

var _linkMenuItem = require('./link-menu-item');

var _linkMenuItem2 = _interopRequireDefault(_linkMenuItem);

var _subheaderMenuItem = require('./subheader-menu-item');

var _subheaderMenuItem2 = _interopRequireDefault(_subheaderMenuItem);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/*eslint-disable */

/***********************
* Nested Menu Component
***********************/
var NestedMenuItem = _react2.default.createClass({
  displayName: 'NestedMenuItem',

  propTypes: {
    active: _react2.default.PropTypes.bool,
    disabled: _react2.default.PropTypes.bool,
    index: _react2.default.PropTypes.number.isRequired,
    menuItemStyle: _react2.default.PropTypes.object,
    menuItems: _react2.default.PropTypes.array.isRequired,
    onItemTap: _react2.default.PropTypes.func,
    onMouseOut: _react2.default.PropTypes.func,
    onMouseOver: _react2.default.PropTypes.func,
    style: _react2.default.PropTypes.object,
    text: _react2.default.PropTypes.string,
    zDepth: _react2.default.PropTypes.number
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_clickAwayable2.default, _stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      disabled: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      open: false,
      activeIndex: 0
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this._positionNestedMenu();
    _reactDom2.default.findDOMNode(this).focus();
  },
  componentDidUpdate: function componentDidUpdate() {
    this._positionNestedMenu();
  },
  componentClickAway: function componentClickAway() {
    this._closeNestedMenu();
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var styles = {
      root: {
        userSelect: 'none',
        cursor: 'pointer',
        lineHeight: this.getTheme().height + 'px',
        color: this.state.muiTheme.rawTheme.palette.textColor
      },
      icon: {
        float: 'left',
        lineHeight: this.getTheme().height + 'px',
        marginRight: this.getSpacing().desktopGutter
      },
      toggle: {
        marginTop: (this.getTheme().height - this.state.muiTheme.radioButton.size) / 2,
        float: 'right',
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
  getTheme: function getTheme() {
    return this.state.muiTheme.menuItem;
  },
  toggleNestedMenu: function toggleNestedMenu() {
    if (!this.props.disabled) this.setState({ open: !this.state.open });
  },
  isOpen: function isOpen() {
    return this.state.open;
  },
  _positionNestedMenu: function _positionNestedMenu() {
    var el = _reactDom2.default.findDOMNode(this);
    var nestedMenu = _reactDom2.default.findDOMNode(this.refs.nestedMenu);
    nestedMenu.style.left = el.offsetWidth + 'px';
  },
  _openNestedMenu: function _openNestedMenu() {
    if (!this.props.disabled) this.setState({ open: true });
  },
  _closeNestedMenu: function _closeNestedMenu() {
    this.setState({ open: false });
    _reactDom2.default.findDOMNode(this).focus();
  },
  _onParentItemTap: function _onParentItemTap() {
    this.toggleNestedMenu();
  },
  _onMenuItemTap: function _onMenuItemTap(e, index, menuItem) {
    if (this.props.onItemTap) this.props.onItemTap(e, index, menuItem);
    this._closeNestedMenu();
  },
  _handleMouseOver: function _handleMouseOver(e) {
    if (!this.props.disabled && this.props.onMouseOver) this.props.onMouseOver(e, this.props.index);
  },
  _handleMouseOut: function _handleMouseOut(e) {
    if (!this.props.disabled && this.props.onMouseOut) this.props.onMouseOut(e, this.props.index);
  },
  render: function render() {
    var styles = this.getStyles();
    styles = this.mergeStyles(styles.root, this.props.active && !this.props.disabled && styles.rootWhenHovered, {
      position: 'relative'
    }, this.props.style);

    var iconCustomArrowDropRight = {
      marginRight: this.getSpacing().desktopGutterMini * -1,
      color: this.state.muiTheme.dropDownMenu.accentColor
    };

    var _props = this.props;
    var index = _props.index;
    var menuItemStyle = _props.menuItemStyle;

    var other = _objectWithoutProperties(_props, ['index', 'menuItemStyle']);

    return _react2.default.createElement(
      'div',
      {
        ref: 'root',
        style: this.prepareStyles(styles),
        onMouseEnter: this._openNestedMenu,
        onMouseLeave: this._closeNestedMenu,
        onMouseOver: this._handleMouseOver,
        onMouseOut: this._handleMouseOut },
      _react2.default.createElement(
        _menuItem3.default,
        {
          index: index,
          style: menuItemStyle,
          disabled: this.props.disabled,
          iconRightStyle: iconCustomArrowDropRight,
          iconRightClassName: 'muidocs-icon-custom-arrow-drop-right',
          onTouchTap: this._onParentItemTap },
        this.props.text
      ),
      _react2.default.createElement(Menu, _extends({}, other, {
        ref: 'nestedMenu',
        menuItems: this.props.menuItems,
        menuItemStyle: menuItemStyle,
        onItemTap: this._onMenuItemTap,
        hideable: true,
        visible: this.state.open,
        onRequestClose: this._closeNestedMenu,
        zDepth: this.props.zDepth + 1 }))
    );
  }
});

/****************
* Menu Component
****************/
var Menu = _react2.default.createClass({
  displayName: 'Menu',

  propTypes: {
    autoWidth: _react2.default.PropTypes.bool,
    hideable: _react2.default.PropTypes.bool,
    menuItemClassName: _react2.default.PropTypes.string,
    menuItemClassNameLink: _react2.default.PropTypes.string,
    menuItemClassNameSubheader: _react2.default.PropTypes.string,
    menuItemStyle: _react2.default.PropTypes.object,
    menuItemStyleLink: _react2.default.PropTypes.object,
    menuItemStyleSubheader: _react2.default.PropTypes.object,
    menuItems: _react2.default.PropTypes.array.isRequired,
    onItemTap: _react2.default.PropTypes.func,
    onItemToggle: _react2.default.PropTypes.func,
    onRequestClose: _react2.default.PropTypes.func,
    onToggle: _react2.default.PropTypes.func,
    selectedIndex: _react2.default.PropTypes.number,
    style: _react2.default.PropTypes.object,
    visible: _react2.default.PropTypes.bool,
    zDepth: _react2.default.PropTypes.number
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
      autoWidth: true,
      hideable: false,
      visible: true,
      zDepth: 1,
      onRequestClose: function onRequestClose() {}
    };
  },
  getInitialState: function getInitialState() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'This menu component is deprecated use menus/menu instead.') : undefined;

    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      nestedMenuShown: false,
      activeIndex: 0
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    var el = _reactDom2.default.findDOMNode(this);

    //Set the menu width
    this._setKeyWidth(el);

    //Show or Hide the menu according to visibility
    this._renderVisibility();
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });

    //Set the menu width
    this._setKeyWidth(_reactDom2.default.findDOMNode(this));
  },
  componentDidUpdate: function componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible || this.props.menuItems.length !== prevProps.menuItems.length) {
      this._renderVisibility();
    }
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.menu;
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var styles = {
      root: {
        backgroundColor: this.getTheme().containerBackgroundColor,
        paddingTop: this.getSpacing().desktopGutterMini,
        paddingBottom: this.getSpacing().desktopGutterMini,
        transition: _transitions2.default.easeOut(null, 'height'),
        outline: 'none !important'
      },
      subheader: {
        paddingLeft: this.state.muiTheme.menuSubheader.padding,
        paddingRight: this.state.muiTheme.menuSubheader.padding
      },
      hideable: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        zIndex: 1
      },
      item: {
        height: 34
      }
    };

    return styles;
  },
  _getChildren: function _getChildren() {
    var menuItem = undefined;
    var itemComponent = undefined;
    var isDisabled = undefined;

    var styles = this.getStyles();

    this._children = [];
    //This array is used to keep track of all nested menu refs
    this._nestedChildren = [];

    for (var i = 0; i < this.props.menuItems.length; i++) {
      menuItem = this.props.menuItems[i];
      isDisabled = menuItem.disabled === undefined ? false : menuItem.disabled;

      var _menuItem = menuItem;
      var icon = _menuItem.icon;
      var data = _menuItem.data;
      var attribute = _menuItem.attribute;
      var number = _menuItem.number;
      var toggle = _menuItem.toggle;
      var onTouchTap = _menuItem.onTouchTap;

      var other = _objectWithoutProperties(_menuItem, ['icon', 'data', 'attribute', 'number', 'toggle', 'onTouchTap']);

      switch (menuItem.type) {

        case _menuItem3.default.Types.LINK:
          itemComponent = _react2.default.createElement(_linkMenuItem2.default, {
            key: i,
            index: i,
            active: this.state.activeIndex === i,
            text: menuItem.text,
            disabled: isDisabled,
            className: this.props.menuItemClassNameLink,
            style: this.props.menuItemStyleLink,
            payload: menuItem.payload,
            target: menuItem.target });
          break;

        case _menuItem3.default.Types.SUBHEADER:
          itemComponent = _react2.default.createElement(_subheaderMenuItem2.default, {
            key: i,
            index: i,
            className: this.props.menuItemClassNameSubheader,
            style: this.mergeStyles(styles.subheader, this.props.menuItemStyleSubheader),
            firstChild: i === 0,
            text: menuItem.text });
          break;

        case _menuItem3.default.Types.NESTED:
          var _props2 = this.props;
          var zDepth = _props2.zDepth;

          var other = _objectWithoutProperties(_props2, ['zDepth']);

          itemComponent = _react2.default.createElement(NestedMenuItem, _extends({}, other, {
            ref: i,
            key: i,
            index: i,
            nested: true,
            active: this.state.activeIndex === i,
            text: menuItem.text,
            disabled: isDisabled,
            menuItems: menuItem.items,
            menuItemStyle: this.props.menuItemStyle,
            zDepth: this.props.zDepth,
            onMouseEnter: this._onItemActivated,
            onMouseLeave: this._onItemDeactivated,
            onItemTap: this._onNestedItemTap }));
          this._nestedChildren.push(i);
          break;

        default:
          itemComponent = _react2.default.createElement(
            _menuItem3.default,
            _extends({}, other, {
              selected: this.props.selectedIndex === i,
              key: i,
              index: i,
              active: this.state.activeIndex === i,
              icon: menuItem.icon,
              data: menuItem.data,
              className: this.props.menuItemClassName,
              style: this.props.menuItemStyle,
              attribute: menuItem.attribute,
              number: menuItem.number,
              toggle: menuItem.toggle,
              onToggle: this.props.onToggle,
              disabled: isDisabled,
              onTouchTap: this._onItemTap,
              onMouseEnter: this._onItemActivated,
              onMouseLeave: this._onItemDeactivated
            }),
            menuItem.text
          );
      }
      this._children.push(itemComponent);
    }

    return this._children;
  },
  _setKeyWidth: function _setKeyWidth(el) {
    //Update the menu width
    var menuWidth = '100%';

    if (this.props.autoWidth) {
      el.style.width = 'auto';
      menuWidth = _keyLine2.default.getIncrementalDim(el.offsetWidth) + 'px';
    }

    el.style.width = menuWidth;
  },
  _renderVisibility: function _renderVisibility() {
    if (this.props.hideable) {
      if (this.props.visible) this._expandHideableMenu();else this._collapseHideableMenu();
    }
  },
  _expandHideableMenu: function _expandHideableMenu() {
    var _this = this;

    var el = _reactDom2.default.findDOMNode(this);
    var container = _reactDom2.default.findDOMNode(this.refs.paperContainer);
    var padding = this.getSpacing().desktopGutterMini;
    var height = this._getHiddenMenuHeight(el, padding);

    //Add transition
    if (!el.style.transition) {
      el.style.transition = _transitions2.default.easeOut();
    }

    this._nextAnimationFrame(function () {
      container.style.overflow = 'hidden';

      // Yeild to the DOM, then apply height and padding. This makes the transition smoother.
      el.style.paddingTop = padding + 'px';
      el.style.paddingBottom = padding + 'px';
      el.style.height = height + 'px';
      el.style.opacity = 1;

      //Set the overflow to visible after the animation is done so
      //that other nested menus can be shown
      _cssEvent2.default.onTransitionEnd(el, function () {
        //Make sure the menu is open before setting the overflow.
        //This is to accout for fast clicks
        if (_this.props.visible) container.style.overflow = 'visible';
        el.style.transition = null;
        el.focus();
      });
    });
  },
  _getHiddenMenuHeight: function _getHiddenMenuHeight(el, padding) {
    //Add padding to the offset height, because it is not yet set in the style.
    var height = padding * 2;

    //Hide the element and allow the browser to automatically resize it.
    el.style.visibility = 'hidden';
    el.style.height = 'auto';

    //Determine the height of the menu.
    height += el.offsetHeight;

    //Unhide the menu with the height set back to zero.
    el.style.height = '0px';
    el.style.visibility = 'visible';

    return height;
  },
  _collapseHideableMenu: function _collapseHideableMenu() {
    var el = _reactDom2.default.findDOMNode(this);
    var container = _reactDom2.default.findDOMNode(this.refs.paperContainer);
    var originalOpacity = el.style.opacity;

    //Add transition
    if (!el.style.transition && originalOpacity !== '') {
      el.style.transition = _transitions2.default.easeOut();
    }

    this._nextAnimationFrame(function () {
      //Set the overflow to hidden so that animation works properly
      container.style.overflow = 'hidden';

      //Close the menu
      el.style.opacity = 0;
      el.style.height = '0px';
      el.style.paddingTop = '0px';
      el.style.paddingBottom = '0px';

      var end = function end() {
        el.style.transition = null;
      };

      if (originalOpacity === '') end();else _cssEvent2.default.onTransitionEnd(el, end);
    });
  },
  _nextAnimationFrame: function _nextAnimationFrame(func) {
    if (window.requestAnimationFrame) {
      return window.requestAnimationFrame(func);
    }
    return setTimeout(func, 16);
  },
  _onNestedItemTap: function _onNestedItemTap(e, index, menuItem) {
    if (this.props.onItemTap) this.props.onItemTap(e, index, menuItem);
  },
  _onItemTap: function _onItemTap(e, index) {
    if (this.props.onItemTap) this.props.onItemTap(e, index, this.props.menuItems[index]);
  },
  _onItemToggle: function _onItemToggle(e, index, toggled) {
    if (this.props.onItemToggle) this.props.onItemToggle(e, index, this.props.menuItems[index], toggled);
  },
  _onItemActivated: function _onItemActivated(e, index) {
    this.setState({ activeIndex: index });
  },
  _onItemDeactivated: function _onItemDeactivated(e, index) {
    if (this.state.activeKey === index) this.setState({ activeIndex: 0 });
  },
  _onKeyDown: function _onKeyDown(e) {
    if (!(this.state.open || this.props.visible)) return;

    var nested = this._children[this.state.activeIndex];
    if (nested && nested.props.nested && this.refs[this.state.activeIndex].isOpen()) return;

    switch (e.which) {
      case _keyCode2.default.UP:
        this._activatePreviousItem();
        break;
      case _keyCode2.default.DOWN:
        this._activateNextItem();
        break;
      case _keyCode2.default.RIGHT:
        this._tryToggleNested(this.state.activeIndex);
        break;
      case _keyCode2.default.LEFT:
        this._close();
        break;
      case _keyCode2.default.ESC:
        this._close();
        break;
      case _keyCode2.default.TAB:
        this._close();
        return; // so the tab key can propagate
      case _keyCode2.default.ENTER:
      case _keyCode2.default.SPACE:
        e.stopPropagation(); // needs called before the close
        this._triggerSelection(e);
        break;
      default:
        return; //important
    }
    e.preventDefault();
    e.stopPropagation();
  },
  _activatePreviousItem: function _activatePreviousItem() {
    var active = this.state.activeIndex || 0;
    active = Math.max(active - 1, 0);
    this.setState({ activeIndex: active });
  },
  _activateNextItem: function _activateNextItem() {
    var active = this.state.activeIndex || 0;
    active = Math.min(active + 1, this._children.length - 1);
    this.setState({ activeIndex: active });
  },
  _triggerSelection: function _triggerSelection(e) {
    var index = this.state.activeIndex || 0;
    this._onItemTap(e, index);
  },
  _close: function _close() {
    this.props.onRequestClose();
  },
  _tryToggleNested: function _tryToggleNested(index) {
    var item = this.refs[index];
    if (item && item.toggleNestedMenu) item.toggleNestedMenu();
  },
  render: function render() {
    var styles = this.getStyles();
    return _react2.default.createElement(
      _paper2.default,
      {
        ref: 'paperContainer',
        tabIndex: '0',
        onKeyDown: this._onKeyDown,
        zDepth: this.props.zDepth,
        style: this.mergeStyles(styles.root, this.props.hideable && styles.hideable, this.props.style) },
      this._getChildren()
    );
  }
});

exports.default = Menu;
module.exports = exports['default'];