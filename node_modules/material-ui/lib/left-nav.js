'use strict';

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

var _autoPrefix = require('./styles/auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _windowListenable = require('./mixins/window-listenable');

var _windowListenable2 = _interopRequireDefault(_windowListenable);

var _overlay = require('./overlay');

var _overlay2 = _interopRequireDefault(_overlay);

var _paper = require('./paper');

var _paper2 = _interopRequireDefault(_paper);

var _menu = require('./menu/menu');

var _menu2 = _interopRequireDefault(_menu);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _deprecatedPropType = require('./utils/deprecatedPropType');

var _deprecatedPropType2 = _interopRequireDefault(_deprecatedPropType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var openNavEventHandler = null;

var LeftNav = _react2.default.createClass({
  displayName: 'LeftNav',

  propTypes: {
    /**
     * The contents of the `LeftNav`
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Indicates whether swiping sideways when the `LeftNav` is closed should open it.
     */
    disableSwipeToOpen: _react2.default.PropTypes.bool,

    /**
     * Indicates that the `LeftNav` should be docked. In this state, the overlay won't
     * show and clicking on a menu item will not close the `LeftNav`.
     */
    docked: _react2.default.PropTypes.bool,

    /**
     * A react component that will be displayed above all the menu items.
     * Usually, this is used for a logo or a profile image.
     */
    header: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.element, 'Instead, use composability.'),

    /**
     * Class name for the menuItem.
     */
    menuItemClassName: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.string, 'It will be removed with menuItems.'),

    /**
     * Class name for the link menuItem.
     */
    menuItemClassNameLink: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.string, 'It will be removed with menuItems.'),

    /**
     * Class name for the subheader menuItem.
     */
    menuItemClassNameSubheader: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.string, 'It will be removed with menuItems.'),

    /**
     * JSON data representing all menu items to render.
     */
    menuItems: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.array, 'Instead, use composability.'),

    /**
     * Fired when a menu item is clicked that is not the
     * one currently selected. Note that this requires the `injectTapEventPlugin`
     * component. See the "Get Started" section for more detail.
     */
    onChange: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.func, 'It will be removed with menuItems.'),

    /**
     * Fired when the component is opened.
     */
    onNavClose: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.func, 'Instead, use onRequestChange.'),

    /**
     * Fired when the component is closed.
     */
    onNavOpen: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.func, 'Instead, use onRequestChange.'),

    /**
     * Callback function that is fired when the open state of the `LeftNav` is
     * requested to be changed. The provided open argument determines whether
     * the `LeftNav` is requested to be opened or closed. Also, the reason
     * argument states why the `LeftNav` got closed or opend. It can be either
     * `'clickaway'` for menuItem and overlay clicks, `'escape'` for pressing the
     * escape key and 'swipe' for swiping. For opening the reason is always `'swipe'`.
     */
    onRequestChange: _react2.default.PropTypes.func,

    /**
     * Indicates that the `LeftNav` should be opened, closed or uncontrolled.
     * Providing a boolean will turn the `LeftNav` into a controlled component.
     */
    open: _react2.default.PropTypes.bool,

    /**
     * Positions the `LeftNav` to open from the right side.
     */
    openRight: _react2.default.PropTypes.bool,

    /**
     * The `className` to add to the `Overlay` component that is rendered behind the `LeftNav`.
     */
    overlayClassName: _react2.default.PropTypes.string,

    /**
     * Overrides the inline-styles of the `Overlay` component that is rendered behind the `LeftNav`.
     */
    overlayStyle: _react2.default.PropTypes.object,

    /**
     * Indicates the particular item in the menuItems array that is currently selected.
     */
    selectedIndex: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.number, 'It will be removed with menuItems.'),

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The width of the left most (or right most) area in pixels where the `LeftNav` can be
     * swiped open from. Setting this to `null` spans that area to the entire page
     * (**CAUTION!** Setting this property to `null` might cause issues with sliders and
     * swipeable `Tabs`, use at your own risk).
     */
    swipeAreaWidth: _react2.default.PropTypes.number,

    /**
     * The width of the `LeftNav` in pixels. Defaults to using the values from theme.
     */
    width: _react2.default.PropTypes.number
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default, _windowListenable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      disableSwipeToOpen: false,
      docked: true,
      open: null,
      openRight: false,
      swipeAreaWidth: 30,
      width: null
    };
  },
  getInitialState: function getInitialState() {
    this._maybeSwiping = false;
    this._touchStartX = null;
    this._touchStartY = null;
    this._swipeStartX = null;

    return {
      open: this.props.open !== null ? this.props.open : this.props.docked,
      swiping: null,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this._updateMenuHeight();
    this._enableSwipeHandling();
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    var newState = { muiTheme: newMuiTheme };

    // If docked is changed, change the open state for when uncontrolled.
    if (this.props.docked !== nextProps.docked) newState.open = nextProps.docked;

    // If controlled then the open prop takes precedence.
    if (nextProps.open !== null) newState.open = nextProps.open;

    this.setState(newState);
  },
  componentDidUpdate: function componentDidUpdate() {
    this._updateMenuHeight();
    this._enableSwipeHandling();
  },
  componentWillUnmount: function componentWillUnmount() {
    this._disableSwipeHandling();
  },

  windowListeners: {
    keyup: '_onWindowKeyUp',
    resize: '_onWindowResize'
  },

  toggle: function toggle() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'using methods on left nav has been deprecated. Please refer to documentations.') : undefined;
    if (this.state.open) this.close();else this.open();
    return this;
  },
  close: function close() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'using methods on left nav has been deprecated. Please refer to documentations.') : undefined;
    this.setState({ open: false });
    if (this.props.onNavClose) this.props.onNavClose();
    return this;
  },
  open: function open() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'using methods on left nav has been deprecated. Please refer to documentations.') : undefined;
    this.setState({ open: true });
    if (this.props.onNavOpen) this.props.onNavOpen();
    return this;
  },
  getStyles: function getStyles() {
    var muiTheme = this.state.muiTheme;
    var theme = muiTheme.leftNav;
    var rawTheme = muiTheme.rawTheme;

    var x = this._getTranslateMultiplier() * (this.state.open ? 0 : this._getMaxTranslateX());

    var styles = {
      root: {
        height: '100%',
        width: this.props.width || theme.width,
        position: 'fixed',
        zIndex: muiTheme.zIndex.leftNav,
        left: 0,
        top: 0,
        transform: 'translate3d(' + x + 'px, 0, 0)',
        transition: !this.state.swiping && _transitions2.default.easeOut(null, 'transform', null),
        backgroundColor: theme.color,
        overflow: 'auto'
      },
      menu: {
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        borderRadius: '0'
      },
      overlay: {
        zIndex: muiTheme.zIndex.leftNavOverlay,
        pointerEvents: this.state.open ? 'auto' : 'none' },
      // Bypass mouse events when left nav is closing.
      menuItem: {
        height: rawTheme.spacing.desktopLeftNavMenuItemHeight,
        lineHeight: rawTheme.spacing.desktopLeftNavMenuItemHeight + 'px'
      },
      rootWhenOpenRight: {
        left: 'auto',
        right: 0
      }
    };

    styles.menuItemLink = this.mergeStyles(styles.menuItem, {
      display: 'block',
      textDecoration: 'none',
      color: rawTheme.palette.textColor
    });
    styles.menuItemSubheader = this.mergeStyles(styles.menuItem, {
      overflow: 'hidden'
    });

    return styles;
  },
  _shouldShow: function _shouldShow() {
    return this.state.open || !!this.state.swiping; // component is swiping
  },
  _close: function _close(reason) {
    if (this.props.open === null) this.setState({ open: false });
    if (this.props.onRequestChange) this.props.onRequestChange(false, reason);
    return this;
  },
  _open: function _open(reason) {
    if (this.props.open === null) this.setState({ open: true });
    if (this.props.onRequestChange) this.props.onRequestChange(true, reason);
    return this;
  },
  _updateMenuHeight: function _updateMenuHeight() {
    if (this.props.header) {
      var menu = _reactDom2.default.findDOMNode(this.refs.menuItems);
      if (menu) {
        var container = _reactDom2.default.findDOMNode(this.refs.clickAwayableElement);
        var menuHeight = container.clientHeight - menu.offsetTop;
        menu.style.height = menuHeight + 'px';
      }
    }
  },
  _onMenuItemClick: function _onMenuItemClick(e, key, payload) {
    if (this.props.onChange && this.props.selectedIndex !== key) {
      this.props.onChange(e, key, payload);
    }
    if (!this.props.docked) this._close('clickaway');
  },
  _onOverlayTouchTap: function _onOverlayTouchTap(event) {
    event.preventDefault();
    this._close('clickaway');
  },
  _onWindowKeyUp: function _onWindowKeyUp(e) {
    if (e.keyCode === _keyCode2.default.ESC && !this.props.docked && this.state.open) {
      this._close('escape');
    }
  },
  _onWindowResize: function _onWindowResize() {
    this._updateMenuHeight();
  },
  _getMaxTranslateX: function _getMaxTranslateX() {
    var width = this.props.width || this.state.muiTheme.leftNav.width;
    return width + 10;
  },
  _getTranslateMultiplier: function _getTranslateMultiplier() {
    return this.props.openRight ? 1 : -1;
  },
  _enableSwipeHandling: function _enableSwipeHandling() {
    if (!this.props.docked) {
      document.body.addEventListener('touchstart', this._onBodyTouchStart);
      if (!openNavEventHandler) {
        openNavEventHandler = this._onBodyTouchStart;
      }
    } else {
      this._disableSwipeHandling();
    }
  },
  _disableSwipeHandling: function _disableSwipeHandling() {
    document.body.removeEventListener('touchstart', this._onBodyTouchStart);
    if (openNavEventHandler === this._onBodyTouchStart) {
      openNavEventHandler = null;
    }
  },
  _onBodyTouchStart: function _onBodyTouchStart(e) {

    var swipeAreaWidth = this.props.swipeAreaWidth;

    var touchStartX = e.touches[0].pageX;
    var touchStartY = e.touches[0].pageY;

    // Open only if swiping from far left (or right) while closed
    if (swipeAreaWidth !== null && !this.state.open) {
      if (this.props.openRight) {
        // If openRight is true calculate from the far right
        if (touchStartX < document.body.offsetWidth - swipeAreaWidth) return;
      } else {
        // If openRight is false calculate from the far left
        if (touchStartX > swipeAreaWidth) return;
      }
    }

    if (!this.state.open && (openNavEventHandler !== this._onBodyTouchStart || this.props.disableSwipeToOpen)) {
      return;
    }

    this._maybeSwiping = true;
    this._touchStartX = touchStartX;
    this._touchStartY = touchStartY;

    document.body.addEventListener('touchmove', this._onBodyTouchMove);
    document.body.addEventListener('touchend', this._onBodyTouchEnd);
    document.body.addEventListener('touchcancel', this._onBodyTouchEnd);
  },
  _setPosition: function _setPosition(translateX) {
    var leftNav = _reactDom2.default.findDOMNode(this.refs.clickAwayableElement);
    var transformCSS = 'translate3d(' + this._getTranslateMultiplier() * translateX + 'px, 0, 0)';
    this.refs.overlay.setOpacity(1 - translateX / this._getMaxTranslateX());
    _autoPrefix2.default.set(leftNav.style, 'transform', transformCSS, this.state.muiTheme);
  },
  _getTranslateX: function _getTranslateX(currentX) {
    return Math.min(Math.max(this.state.swiping === 'closing' ? this._getTranslateMultiplier() * (currentX - this._swipeStartX) : this._getMaxTranslateX() - this._getTranslateMultiplier() * (this._swipeStartX - currentX), 0), this._getMaxTranslateX());
  },
  _onBodyTouchMove: function _onBodyTouchMove(e) {
    var currentX = e.touches[0].pageX;
    var currentY = e.touches[0].pageY;

    if (this.state.swiping) {
      e.preventDefault();
      this._setPosition(this._getTranslateX(currentX));
    } else if (this._maybeSwiping) {
      var dXAbs = Math.abs(currentX - this._touchStartX);
      var dYAbs = Math.abs(currentY - this._touchStartY);
      // If the user has moved his thumb ten pixels in either direction,
      // we can safely make an assumption about whether he was intending
      // to swipe or scroll.
      var threshold = 10;

      if (dXAbs > threshold && dYAbs <= threshold) {
        this._swipeStartX = currentX;
        this.setState({
          swiping: this.state.open ? 'closing' : 'opening'
        });
        this._setPosition(this._getTranslateX(currentX));
      } else if (dXAbs <= threshold && dYAbs > threshold) {
        this._onBodyTouchEnd();
      }
    }
  },
  _onBodyTouchEnd: function _onBodyTouchEnd(e) {
    if (this.state.swiping) {
      var currentX = e.changedTouches[0].pageX;
      var translateRatio = this._getTranslateX(currentX) / this._getMaxTranslateX();

      this._maybeSwiping = false;
      var swiping = this.state.swiping;
      this.setState({
        swiping: null
      });

      // We have to open or close after setting swiping to null,
      // because only then CSS transition is enabled.
      if (translateRatio > 0.5) {
        if (swiping === 'opening') {
          this._setPosition(this._getMaxTranslateX());
        } else {
          this._close('swipe');
        }
      } else {
        if (swiping === 'opening') {
          this._open('swipe');
        } else {
          this._setPosition(0);
        }
      }
    } else {
      this._maybeSwiping = false;
    }

    document.body.removeEventListener('touchmove', this._onBodyTouchMove);
    document.body.removeEventListener('touchend', this._onBodyTouchEnd);
    document.body.removeEventListener('touchcancel', this._onBodyTouchEnd);
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var docked = _props.docked;
    var header = _props.header;
    var menuItemClassName = _props.menuItemClassName;
    var menuItemClassNameSubheader = _props.menuItemClassNameSubheader;
    var menuItemClassNameLink = _props.menuItemClassNameLink;
    var menuItems = _props.menuItems;
    var openRight = _props.openRight;
    var overlayClassName = _props.overlayClassName;
    var overlayStyle = _props.overlayStyle;
    var selectedIndex = _props.selectedIndex;
    var style = _props.style;

    var styles = this.getStyles();

    var overlay = undefined;
    if (!docked) {
      overlay = _react2.default.createElement(_overlay2.default, {
        ref: 'overlay',
        show: this._shouldShow(),
        className: overlayClassName,
        style: this.mergeStyles(styles.overlay, overlayStyle),
        transitionEnabled: !this.state.swiping,
        onTouchTap: this._onOverlayTouchTap
      });
    }
    var children = undefined;
    if (menuItems === undefined) {
      children = this.props.children;
    } else {
      children = _react2.default.createElement(_menu2.default, {
        ref: 'menuItems',
        style: this.mergeStyles(styles.menu),
        zDepth: 0,
        menuItems: menuItems,
        menuItemStyle: this.mergeStyles(styles.menuItem),
        menuItemStyleLink: this.mergeStyles(styles.menuItemLink),
        menuItemStyleSubheader: this.mergeStyles(styles.menuItemSubheader),
        menuItemClassName: menuItemClassName,
        menuItemClassNameSubheader: menuItemClassNameSubheader,
        menuItemClassNameLink: menuItemClassNameLink,
        selectedIndex: selectedIndex,
        onItemTap: this._onMenuItemClick
      });
    }

    return _react2.default.createElement(
      'div',
      null,
      overlay,
      _react2.default.createElement(
        _paper2.default,
        {
          ref: 'clickAwayableElement',
          zDepth: 2,
          rounded: false,
          transitionEnabled: !this.state.swiping,
          className: className,
          style: this.mergeStyles(styles.root, openRight && styles.rootWhenOpenRight, style)
        },
        header,
        children
      )
    );
  }
});

exports.default = LeftNav;
module.exports = exports['default'];