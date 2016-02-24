'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _colors = require('../styles/colors');

var _colors2 = _interopRequireDefault(_colors);

var _popover = require('../popover/popover');

var _popover2 = _interopRequireDefault(_popover);

var _check = require('../svg-icons/navigation/check');

var _check2 = _interopRequireDefault(_check);

var _listItem = require('../lists/list-item');

var _listItem2 = _interopRequireDefault(_listItem);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _menu = require('./menu');

var _menu2 = _interopRequireDefault(_menu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var nestedMenuStyle = {
  position: 'relative'
};

var MenuItem = _react2.default.createClass({
  displayName: 'MenuItem',

  propTypes: {
    /**
     * If true, a left check mark will be rendered.
     */
    checked: _react2.default.PropTypes.bool,

    /**
     * Elements passed as children to inner ListItem.
     */
    children: _react2.default.PropTypes.node,

    /**
     * Indicates if the menu should render with compact desktop styles.
     */
    desktop: _react2.default.PropTypes.bool,

    /**
     * Disables a menu item.
     */
    disabled: _react2.default.PropTypes.bool,

    /**
     * Prop passed down to ListItem that tells it what kind of focus it has.
     */
    focusState: _react2.default.PropTypes.oneOf(['none', 'focused', 'keyboard-focused']),

    /**
     * Style overrides for the inner div.
     */
    innerDivStyle: _react2.default.PropTypes.object,

    /**
     * If true, the children will be indented.
     * Only needed when there is no leftIcon.
     */
    insetChildren: _react2.default.PropTypes.bool,

    /**
     * This is the SvgIcon or FontIcon to be displayed on the left side.
     */
    leftIcon: _react2.default.PropTypes.element,

    /**
     * Nested MenuItems for this MenuItem. Used to make nested menus.
     */
    menuItems: _react2.default.PropTypes.node,

    /**
     * Fired when the element is touchTapped.
     */
    onTouchTap: _react2.default.PropTypes.func,

    /**
     * This is the SvgIcon or FontIcon to be displayed on the right side.
     */
    rightIcon: _react2.default.PropTypes.element,

    /**
     * This is the block element that contains the secondary text.
     * If a string is passed in, a div tag will be rendered.
     */
    secondaryText: _react2.default.PropTypes.node,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The value of the menu item.
     */
    value: _react2.default.PropTypes.any
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_reactAddonsPureRenderMixin2.default, _stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      checked: false,
      desktop: false,
      disabled: false,
      focusState: 'none',
      insetChildren: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      open: false
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this._applyFocusState();
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });

    if (this.state.open && nextProps.focusState === 'none') {
      this._onRequestClose();
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    this._applyFocusState();
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.state.open) {
      this.setState({
        open: false
      });
    }
  },
  _applyFocusState: function _applyFocusState() {
    this.refs.listItem.applyFocusState(this.props.focusState);
  },
  _cloneMenuItem: function _cloneMenuItem(item) {
    var _this = this;

    return _react2.default.cloneElement(item, {
      onTouchTap: function onTouchTap(event) {
        if (!item.props.menuItems) {
          _this._onRequestClose();
        }

        if (item.props.onTouchTap) {
          item.props.onTouchTap(event);
        }
      },
      onRequestClose: this._onRequestClose
    });
  },
  _onTouchTap: function _onTouchTap(event) {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: _reactDom2.default.findDOMNode(this)
    });

    if (this.props.onTouchTap) {
      this.props.onTouchTap(event);
    }
  },
  _onRequestClose: function _onRequestClose() {
    this.setState({
      open: false,
      anchorEl: null
    });
  },
  render: function render() {
    var _props = this.props;
    var checked = _props.checked;
    var children = _props.children;
    var desktop = _props.desktop;
    var disabled = _props.disabled;
    var focusState = _props.focusState;
    var innerDivStyle = _props.innerDivStyle;
    var insetChildren = _props.insetChildren;
    var leftIcon = _props.leftIcon;
    var menuItems = _props.menuItems;
    var rightIcon = _props.rightIcon;
    var secondaryText = _props.secondaryText;
    var style = _props.style;
    var value = _props.value;

    var other = _objectWithoutProperties(_props, ['checked', 'children', 'desktop', 'disabled', 'focusState', 'innerDivStyle', 'insetChildren', 'leftIcon', 'menuItems', 'rightIcon', 'secondaryText', 'style', 'value']);

    var disabledColor = this.state.muiTheme.rawTheme.palette.disabledColor;
    var textColor = this.state.muiTheme.rawTheme.palette.textColor;
    var leftIndent = desktop ? 64 : 72;
    var sidePadding = desktop ? 24 : 16;

    var styles = {
      root: {
        color: disabled ? disabledColor : textColor,
        lineHeight: desktop ? '32px' : '48px',
        fontSize: desktop ? 15 : 16,
        whiteSpace: 'nowrap'
      },

      innerDivStyle: {
        paddingLeft: leftIcon || insetChildren || checked ? leftIndent : sidePadding,
        paddingRight: sidePadding,
        paddingBottom: 0,
        paddingTop: 0
      },

      secondaryText: {
        float: 'right'
      },

      leftIconDesktop: {
        margin: 0,
        left: 24,
        top: 4
      },

      rightIconDesktop: {
        margin: 0,
        right: 24,
        top: 4,
        fill: _colors2.default.grey600
      }
    };

    var mergedRootStyles = this.mergeStyles(styles.root, style);
    var mergedInnerDivStyles = this.mergeStyles(styles.innerDivStyle, innerDivStyle);

    //Left Icon
    var leftIconElement = leftIcon ? leftIcon : checked ? _react2.default.createElement(_check2.default, null) : null;
    if (leftIconElement && desktop) {
      var mergedLeftIconStyles = this.mergeStyles(styles.leftIconDesktop, leftIconElement.props.style);
      leftIconElement = _react2.default.cloneElement(leftIconElement, { style: mergedLeftIconStyles });
    }

    //Right Icon
    var rightIconElement = undefined;
    if (rightIcon) {
      var mergedRightIconStyles = desktop ? this.mergeStyles(styles.rightIconDesktop, rightIcon.props.style) : rightIcon.props.style;
      rightIconElement = _react2.default.cloneElement(rightIcon, { style: mergedRightIconStyles });
    }

    //Secondary Text
    var secondaryTextElement = undefined;
    if (secondaryText) {
      var secondaryTextIsAnElement = _react2.default.isValidElement(secondaryText);
      var mergedSecondaryTextStyles = secondaryTextIsAnElement ? this.mergeStyles(styles.secondaryText, secondaryText.props.style) : null;

      secondaryTextElement = secondaryTextIsAnElement ? _react2.default.cloneElement(secondaryText, { style: mergedSecondaryTextStyles }) : _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.secondaryText) },
        secondaryText
      );
    }
    var childMenuPopover = undefined;
    if (menuItems) {
      childMenuPopover = _react2.default.createElement(
        _popover2.default,
        {
          anchorOrigin: { horizontal: 'right', vertical: 'top' },
          anchorEl: this.state.anchorEl,
          open: this.state.open,
          useLayerForClickAway: false,
          onRequestClose: this._onRequestClose
        },
        _react2.default.createElement(
          _menu2.default,
          { desktop: desktop, disabled: disabled, style: nestedMenuStyle },
          _react2.default.Children.map(menuItems, this._cloneMenuItem)
        )
      );
      other.onTouchTap = this._onTouchTap;
    }

    return _react2.default.createElement(
      _listItem2.default,
      _extends({}, other, {
        disabled: disabled,
        innerDivStyle: mergedInnerDivStyles,
        insetChildren: insetChildren,
        leftIcon: leftIconElement,
        ref: 'listItem',
        rightIcon: rightIconElement,
        style: mergedRootStyles
      }),
      children,
      secondaryTextElement,
      childMenuPopover
    );
  }
});

exports.default = MenuItem;
module.exports = exports['default'];