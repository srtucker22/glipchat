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

var _colorManipulator = require('../utils/color-manipulator');

var _colorManipulator2 = _interopRequireDefault(_colorManipulator);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _colors = require('../styles/colors');

var _colors2 = _interopRequireDefault(_colors);

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _typography = require('../styles/typography');

var _typography2 = _interopRequireDefault(_typography);

var _enhancedButton = require('../enhanced-button');

var _enhancedButton2 = _interopRequireDefault(_enhancedButton);

var _iconButton = require('../icon-button');

var _iconButton2 = _interopRequireDefault(_iconButton);

var _arrowDropUp = require('../svg-icons/navigation/arrow-drop-up');

var _arrowDropUp2 = _interopRequireDefault(_arrowDropUp);

var _arrowDropDown = require('../svg-icons/navigation/arrow-drop-down');

var _arrowDropDown2 = _interopRequireDefault(_arrowDropDown);

var _nestedList = require('./nested-list');

var _nestedList2 = _interopRequireDefault(_nestedList);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ListItem = _react2.default.createClass({
  displayName: 'ListItem',

  propTypes: {
    /**
     * Generate a nested list indicator icon when
     * nested list items are detected. Set to false
     * if you do not want an indicator auto-generated.
     * Note that an indicator will not be created if a
     * rightIcon/Button has been specified.
     */
    autoGenerateNestedIndicator: _react2.default.PropTypes.bool,

    /**
     * Children passed into the ListItem.
     */
    children: _react2.default.PropTypes.node,

    /**
     * Does not allow the element to be focused by the keyboard.
     */
    disableKeyboardFocus: _react2.default.PropTypes.bool,

    /**
     * If true, the list-item will not be clickable
     * and will not display hover affects.
     * This is automatically disabled if leftCheckbox
     * or rightToggle is set.
     */
    disabled: _react2.default.PropTypes.bool,

    /**
     * Controls whether or not the child ListItems are initially displayed.
     */
    initiallyOpen: _react2.default.PropTypes.bool,

    /**
     * Style prop for the innder div element.
     */
    innerDivStyle: _react2.default.PropTypes.object,

    /**
     * If true, the children will be indented by 72px.
     * Only needed if there is no left avatar or left icon.
     */
    insetChildren: _react2.default.PropTypes.bool,

    /**
     * This is the Avatar element to be displayed on the left side.
     */
    leftAvatar: _react2.default.PropTypes.element,

    /**
     * This is the Checkbox element to be displayed on the left side.
     */
    leftCheckbox: _react2.default.PropTypes.element,

    /**
     * This is the SvgIcon or FontIcon to be displayed on the left side.
     */
    leftIcon: _react2.default.PropTypes.element,

    /**
     * An array of ListItems to nest underneath the current ListItem.
     */
    nestedItems: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element),

    /**
     * Controls how deep a ListItem appears.
     * This property is automatically managed so modify at your own risk.
     */
    nestedLevel: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the nestedItems NestedList.
     */
    nestedListStyle: _react2.default.PropTypes.object,

    /**
     * Called when the ListItem has keyboard focus.
     */
    onKeyboardFocus: _react2.default.PropTypes.func,

    /**
     * Called when the mouse is over the ListItem.
     */
    onMouseEnter: _react2.default.PropTypes.func,

    /**
     * Called when the mouse is no longer over the ListItem.
     */
    onMouseLeave: _react2.default.PropTypes.func,

    /**
     * Called when the ListItem toggles its nested ListItems.
     */
    onNestedListToggle: _react2.default.PropTypes.func,

    /**
     * Called when touches start.
     */
    onTouchStart: _react2.default.PropTypes.func,

    /**
     * Called when a touch tap event occures on the component.
     */
    onTouchTap: _react2.default.PropTypes.func,

    /**
     * This is the block element that contains the primary text.
     * If a string is passed in, a div tag will be rendered.
     */
    primaryText: _react2.default.PropTypes.node,

    /**
     * If provided, tapping on the primary text
     * of the item toggles the nested list.
     */
    primaryTogglesNestedList: _react2.default.PropTypes.bool,

    /**
     * This is the avatar element to be displayed on the right side.
     */
    rightAvatar: _react2.default.PropTypes.element,

    /**
     * This is the SvgIcon or FontIcon to be displayed on the right side.
     */
    rightIcon: _react2.default.PropTypes.element,

    /**
     * This is the IconButton to be displayed on the right side.
     * Hovering over this button will remove the ListItem hover.
     * Also, clicking on this button will not trigger a
     * ListItem ripple. The event will be stopped and prevented
     * from bubbling up to cause a ListItem click.
     */
    rightIconButton: _react2.default.PropTypes.element,

    /**
     * This is the Toggle element to display on the right side.
     */
    rightToggle: _react2.default.PropTypes.element,

    /**
     * This is the block element that contains the secondary text.
     * If a string is passed in, a div tag will be rendered.
     */
    secondaryText: _react2.default.PropTypes.node,

    /**
     * Can be 1 or 2. This is the number of secondary
     * text lines before ellipsis will show.
     */
    secondaryTextLines: _react2.default.PropTypes.oneOf([1, 2]),

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

  mixins: [_reactAddonsPureRenderMixin2.default, _stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      autoGenerateNestedIndicator: true,
      disableKeyboardFocus: false,
      disabled: false,
      initiallyOpen: false,
      insetChildren: false,
      nestedItems: [],
      nestedLevel: 0,
      onKeyboardFocus: function onKeyboardFocus() {},
      onMouseEnter: function onMouseEnter() {},
      onMouseLeave: function onMouseLeave() {},
      onNestedListToggle: function onNestedListToggle() {},
      onTouchStart: function onTouchStart() {},
      primaryTogglesNestedList: false,
      secondaryTextLines: 1
    };
  },
  getInitialState: function getInitialState() {
    return {
      hovered: false,
      isKeyboardFocused: false,
      open: this.props.initiallyOpen,
      rightIconButtonHovered: false,
      rightIconButtonKeyboardFocused: false,
      touch: false,
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
  applyFocusState: function applyFocusState(focusState) {
    var button = this.refs.enhancedButton;
    var buttonEl = _reactDom2.default.findDOMNode(button);

    if (button) {
      switch (focusState) {
        case 'none':
          buttonEl.blur();
          break;
        case 'focused':
          buttonEl.focus();
          break;
        case 'keyboard-focused':
          button.setKeyboardFocus();
          buttonEl.focus();
          break;
      }
    }
  },
  _createDisabledElement: function _createDisabledElement(styles, contentChildren, additionalProps) {
    var _props = this.props;
    var innerDivStyle = _props.innerDivStyle;
    var style = _props.style;

    var mergedDivStyles = this.mergeStyles(styles.root, styles.innerDiv, innerDivStyle, style);

    return _react2.default.createElement(
      'div',
      _extends({}, additionalProps, {
        style: this.prepareStyles(mergedDivStyles)
      }),
      contentChildren
    );
  },
  _createLabelElement: function _createLabelElement(styles, contentChildren, additionalProps) {
    var _props2 = this.props;
    var innerDivStyle = _props2.innerDivStyle;
    var style = _props2.style;

    var mergedLabelStyles = this.mergeStyles(styles.root, styles.innerDiv, innerDivStyle, styles.label, style);

    return _react2.default.createElement(
      'label',
      _extends({}, additionalProps, {
        style: this.prepareStyles(mergedLabelStyles)
      }),
      contentChildren
    );
  },
  _createTextElement: function _createTextElement(styles, data, key) {
    var isAnElement = _react2.default.isValidElement(data);
    var mergedStyles = isAnElement ? this.mergeStyles(styles, data.props.style) : null;

    return isAnElement ? _react2.default.cloneElement(data, {
      key: key,
      style: this.prepareStyles(mergedStyles)
    }) : _react2.default.createElement(
      'div',
      { key: key, style: this.prepareStyles(styles) },
      data
    );
  },
  _handleKeyboardFocus: function _handleKeyboardFocus(e, isKeyboardFocused) {
    this.setState({ isKeyboardFocused: isKeyboardFocused });
    this.props.onKeyboardFocus(e, isKeyboardFocused);
  },
  _handleMouseEnter: function _handleMouseEnter(e) {
    if (!this.state.touch) this.setState({ hovered: true });
    this.props.onMouseEnter(e);
  },
  _handleMouseLeave: function _handleMouseLeave(e) {
    this.setState({ hovered: false });
    this.props.onMouseLeave(e);
  },
  _handleNestedListToggle: function _handleNestedListToggle(e) {
    e.stopPropagation();
    this.setState({ open: !this.state.open });
    this.props.onNestedListToggle(this);
  },
  _handleRightIconButtonKeyboardFocus: function _handleRightIconButtonKeyboardFocus(e, isKeyboardFocused) {
    var iconButton = this.props.rightIconButton;
    var newState = {};

    newState.rightIconButtonKeyboardFocused = isKeyboardFocused;
    if (isKeyboardFocused) newState.isKeyboardFocused = false;
    this.setState(newState);

    if (iconButton && iconButton.props.onKeyboardFocus) iconButton.props.onKeyboardFocus(e, isKeyboardFocused);
  },
  _handleRightIconButtonMouseDown: function _handleRightIconButtonMouseDown(e) {
    var iconButton = this.props.rightIconButton;
    e.stopPropagation();
    if (iconButton && iconButton.props.onMouseDown) iconButton.props.onMouseDown(e);
  },
  _handleRightIconButtonMouseLeave: function _handleRightIconButtonMouseLeave(e) {
    var iconButton = this.props.rightIconButton;
    this.setState({ rightIconButtonHovered: false });
    if (iconButton && iconButton.props.onMouseLeave) iconButton.props.onMouseLeave(e);
  },
  _handleRightIconButtonMouseEnter: function _handleRightIconButtonMouseEnter(e) {
    var iconButton = this.props.rightIconButton;
    this.setState({ rightIconButtonHovered: true });
    if (iconButton && iconButton.props.onMouseEnter) iconButton.props.onMouseEnter(e);
  },
  _handleRightIconButtonMouseUp: function _handleRightIconButtonMouseUp(e) {
    var iconButton = this.props.rightIconButton;
    e.stopPropagation();
    if (iconButton && iconButton.props.onMouseUp) iconButton.props.onMouseUp(e);
  },
  _handleRightIconButtonTouchTap: function _handleRightIconButtonTouchTap(e) {
    var iconButton = this.props.rightIconButton;

    //Stop the event from bubbling up to the list-item
    e.stopPropagation();
    if (iconButton && iconButton.props.onTouchTap) iconButton.props.onTouchTap(e);
  },
  _handleTouchStart: function _handleTouchStart(e) {
    this.setState({ touch: true });
    this.props.onTouchStart(e);
  },
  _pushElement: function _pushElement(children, element, baseStyles, additionalProps) {
    if (element) {
      var styles = this.mergeStyles(baseStyles, element.props.style);
      children.push(_react2.default.cloneElement(element, _extends({
        key: children.length,
        style: styles
      }, additionalProps)));
    }
  },
  render: function render() {
    var _props3 = this.props;
    var autoGenerateNestedIndicator = _props3.autoGenerateNestedIndicator;
    var children = _props3.children;
    var disabled = _props3.disabled;
    var disableKeyboardFocus = _props3.disableKeyboardFocus;
    var innerDivStyle = _props3.innerDivStyle;
    var insetChildren = _props3.insetChildren;
    var leftAvatar = _props3.leftAvatar;
    var leftCheckbox = _props3.leftCheckbox;
    var leftIcon = _props3.leftIcon;
    var nestedItems = _props3.nestedItems;
    var nestedLevel = _props3.nestedLevel;
    var nestedListStyle = _props3.nestedListStyle;
    var onKeyboardFocus = _props3.onKeyboardFocus;
    var onMouseLeave = _props3.onMouseLeave;
    var onMouseEnter = _props3.onMouseEnter;
    var onTouchStart = _props3.onTouchStart;
    var onTouchTap = _props3.onTouchTap;
    var rightAvatar = _props3.rightAvatar;
    var rightIcon = _props3.rightIcon;
    var rightIconButton = _props3.rightIconButton;
    var rightToggle = _props3.rightToggle;
    var primaryText = _props3.primaryText;
    var primaryTogglesNestedList = _props3.primaryTogglesNestedList;
    var secondaryText = _props3.secondaryText;
    var secondaryTextLines = _props3.secondaryTextLines;
    var style = _props3.style;

    var other = _objectWithoutProperties(_props3, ['autoGenerateNestedIndicator', 'children', 'disabled', 'disableKeyboardFocus', 'innerDivStyle', 'insetChildren', 'leftAvatar', 'leftCheckbox', 'leftIcon', 'nestedItems', 'nestedLevel', 'nestedListStyle', 'onKeyboardFocus', 'onMouseLeave', 'onMouseEnter', 'onTouchStart', 'onTouchTap', 'rightAvatar', 'rightIcon', 'rightIconButton', 'rightToggle', 'primaryText', 'primaryTogglesNestedList', 'secondaryText', 'secondaryTextLines', 'style']);

    var textColor = this.state.muiTheme.rawTheme.palette.textColor;
    var hoverColor = _colorManipulator2.default.fade(textColor, 0.1);
    var singleAvatar = !secondaryText && (leftAvatar || rightAvatar);
    var singleNoAvatar = !secondaryText && !(leftAvatar || rightAvatar);
    var twoLine = secondaryText && secondaryTextLines === 1;
    var threeLine = secondaryText && secondaryTextLines > 1;
    var hasCheckbox = leftCheckbox || rightToggle;

    var styles = {
      root: {
        backgroundColor: (this.state.isKeyboardFocused || this.state.hovered) && !this.state.rightIconButtonHovered && !this.state.rightIconButtonKeyboardFocused ? hoverColor : null,
        color: textColor,
        display: 'block',
        fontSize: 16,
        lineHeight: '16px',
        position: 'relative',
        transition: _transitions2.default.easeOut()
      },

      //This inner div is needed so that ripples will span the entire container
      innerDiv: {
        marginLeft: nestedLevel * this.state.muiTheme.listItem.nestedLevelDepth,
        paddingLeft: leftIcon || leftAvatar || leftCheckbox || insetChildren ? 72 : 16,
        paddingRight: rightIcon || rightAvatar || rightIconButton ? 56 : rightToggle ? 72 : 16,
        paddingBottom: singleAvatar ? 20 : 16,
        paddingTop: singleNoAvatar || threeLine ? 16 : 20,
        position: 'relative'
      },

      icons: {
        height: 24,
        width: 24,
        display: 'block',
        position: 'absolute',
        top: twoLine ? 12 : singleAvatar ? 4 : 0,
        margin: 12
      },

      leftIcon: {
        color: _colors2.default.grey600,
        fill: _colors2.default.grey600,
        left: 4
      },

      rightIcon: {
        color: _colors2.default.grey400,
        fill: _colors2.default.grey400,
        right: 4
      },

      avatars: {
        position: 'absolute',
        top: singleAvatar ? 8 : 16
      },

      label: {
        cursor: 'pointer'
      },

      leftAvatar: {
        left: 16
      },

      rightAvatar: {
        right: 16
      },

      leftCheckbox: {
        position: 'absolute',
        display: 'block',
        width: 24,
        top: twoLine ? 24 : singleAvatar ? 16 : 12,
        left: 16
      },

      primaryText: {},

      rightIconButton: {
        position: 'absolute',
        display: 'block',
        top: twoLine ? 12 : singleAvatar ? 4 : 0,
        right: 4
      },

      rightToggle: {
        position: 'absolute',
        display: 'block',
        width: 54,
        top: twoLine ? 25 : singleAvatar ? 17 : 13,
        right: 8
      },

      secondaryText: {
        fontSize: 14,
        lineHeight: threeLine ? '18px' : '16px',
        height: threeLine ? 36 : 16,
        margin: 0,
        marginTop: 4,
        color: _typography2.default.textLightBlack,

        //needed for 2 and 3 line ellipsis
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: threeLine ? null : 'nowrap',
        display: threeLine ? '-webkit-box' : null,
        WebkitLineClamp: threeLine ? 2 : null,
        WebkitBoxOrient: threeLine ? 'vertical' : null
      }
    };

    var contentChildren = [children];

    if (leftIcon) {
      this._pushElement(contentChildren, leftIcon, this.mergeStyles(styles.icons, styles.leftIcon));
    }

    if (rightIcon) {
      this._pushElement(contentChildren, rightIcon, this.mergeStyles(styles.icons, styles.rightIcon));
    }

    if (leftAvatar) {
      this._pushElement(contentChildren, leftAvatar, this.mergeStyles(styles.avatars, styles.leftAvatar));
    }

    if (rightAvatar) {
      this._pushElement(contentChildren, rightAvatar, this.mergeStyles(styles.avatars, styles.rightAvatar));
    }

    if (leftCheckbox) {
      this._pushElement(contentChildren, leftCheckbox, this.mergeStyles(styles.leftCheckbox));
    }

    //RightIconButtonElement
    var hasNestListItems = nestedItems.length;
    var hasRightElement = rightAvatar || rightIcon || rightIconButton || rightToggle;
    var needsNestedIndicator = hasNestListItems && autoGenerateNestedIndicator && !hasRightElement;

    if (rightIconButton || needsNestedIndicator) {
      var rightIconButtonElement = rightIconButton;
      var rightIconButtonHandlers = {
        onKeyboardFocus: this._handleRightIconButtonKeyboardFocus,
        onMouseEnter: this._handleRightIconButtonMouseEnter,
        onMouseLeave: this._handleRightIconButtonMouseLeave,
        onTouchTap: this._handleRightIconButtonTouchTap,
        onMouseDown: this._handleRightIconButtonMouseUp,
        onMouseUp: this._handleRightIconButtonMouseUp
      };

      // Create a nested list indicator icon if we don't have an icon on the right
      if (needsNestedIndicator) {
        rightIconButtonElement = this.state.open ? _react2.default.createElement(
          _iconButton2.default,
          null,
          _react2.default.createElement(_arrowDropUp2.default, null)
        ) : _react2.default.createElement(
          _iconButton2.default,
          null,
          _react2.default.createElement(_arrowDropDown2.default, null)
        );
        rightIconButtonHandlers.onTouchTap = this._handleNestedListToggle;
      }

      this._pushElement(contentChildren, rightIconButtonElement, this.mergeStyles(styles.rightIconButton), rightIconButtonHandlers);
    }

    if (rightToggle) {
      this._pushElement(contentChildren, rightToggle, this.mergeStyles(styles.rightToggle));
    }

    if (primaryText) {
      var secondaryTextElement = this._createTextElement(styles.primaryText, primaryText, 'primaryText');
      contentChildren.push(secondaryTextElement);
    }

    if (secondaryText) {
      var secondaryTextElement = this._createTextElement(styles.secondaryText, secondaryText, 'secondaryText');
      contentChildren.push(secondaryTextElement);
    }

    var nestedList = nestedItems.length ? _react2.default.createElement(
      _nestedList2.default,
      { nestedLevel: nestedLevel + 1, open: this.state.open, style: nestedListStyle },
      nestedItems
    ) : undefined;

    return _react2.default.createElement(
      'div',
      null,
      hasCheckbox ? this._createLabelElement(styles, contentChildren, other) : disabled ? this._createDisabledElement(styles, contentChildren, other) : _react2.default.createElement(
        _enhancedButton2.default,
        _extends({}, other, {
          disabled: disabled,
          disableKeyboardFocus: disableKeyboardFocus || this.state.rightIconButtonKeyboardFocused,
          linkButton: true,
          onKeyboardFocus: this._handleKeyboardFocus,
          onMouseLeave: this._handleMouseLeave,
          onMouseEnter: this._handleMouseEnter,
          onTouchStart: this._handleTouchStart,
          onTouchTap: primaryTogglesNestedList ? this._handleNestedListToggle : onTouchTap,
          ref: 'enhancedButton',
          style: this.mergeStyles(styles.root, style)
        }),
        _react2.default.createElement(
          'div',
          { style: this.prepareStyles(styles.innerDiv, innerDivStyle) },
          contentChildren
        )
      ),
      nestedList
    );
  }
});

exports.default = ListItem;
module.exports = exports['default'];