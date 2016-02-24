'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _keyCode = require('./utils/key-code');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _textField = require('./text-field');

var _textField2 = _interopRequireDefault(_textField);

var _menu = require('./menus/menu');

var _menu2 = _interopRequireDefault(_menu);

var _menuItem = require('./menus/menu-item');

var _menuItem2 = _interopRequireDefault(_menuItem);

var _divider = require('./divider');

var _divider2 = _interopRequireDefault(_divider);

var _popover = require('./popover/popover');

var _popover2 = _interopRequireDefault(_popover);

var _propTypes = require('./utils/prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _deprecatedPropType = require('./utils/deprecatedPropType');

var _deprecatedPropType2 = _interopRequireDefault(_deprecatedPropType);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var AutoComplete = _react2.default.createClass({
  displayName: 'AutoComplete',

  propTypes: {
    /**
     * Location of the anchor for the auto complete.
     */
    anchorOrigin: _propTypes2.default.origin,

    /**
     * Whether or not the auto complete is animated as it is toggled.
     */
    animated: _react2.default.PropTypes.bool,

    /**
     * Array of strings or nodes used to populate the list.
     */
    dataSource: _react2.default.PropTypes.array,

    /**
     * Disables focus ripple when true.
     */
    disableFocusRipple: _react2.default.PropTypes.bool,

    /**
     * Override style prop for error.
     */
    errorStyle: _react2.default.PropTypes.object,

    /**
     * The error content to display.
     */
    errorText: _react2.default.PropTypes.string,

    /**
     * Function used to filter the auto complete.
     */
    filter: _react2.default.PropTypes.func,

    /**
     * The content to use for adding floating label element.
     */
    floatingLabelText: _react2.default.PropTypes.string,

    /**
     * If true, the field receives the property `width: 100%`.
     */
    fullWidth: _react2.default.PropTypes.bool,

    /**
     * The hint content to display.
     */
    hintText: _react2.default.PropTypes.string,

    /**
     * Override style for list.
     */
    listStyle: _react2.default.PropTypes.object,

    /**
     * Delay for closing time of the menu.
     */
    menuCloseDelay: _react2.default.PropTypes.number,

    /**
     * Props to be passed to menu.
     */
    menuProps: _react2.default.PropTypes.object,

    /**
     * Override style for menu.
     */
    menuStyle: _react2.default.PropTypes.object,

    /**
     * Gets called when list item is clicked or pressed enter.
     */
    onNewRequest: _react2.default.PropTypes.func,

    /**
     * Gets called each time the user updates the text field.
     */
    onUpdateInput: _react2.default.PropTypes.func,

    /**
     * Auto complete menu is open if true.
     */
    open: _react2.default.PropTypes.bool,

    /**
     * Text being input to auto complete.
     */
    searchText: _react2.default.PropTypes.string,
    showAllItems: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.bool, 'showAllItems is deprecated, use noFilter instead'),

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Origin for location of target.
     */
    targetOrigin: _propTypes2.default.origin,

    /**
     * Delay for touch tap event closing of auto complete.
     */
    touchTapCloseDelay: _react2.default.PropTypes.number,

    /**
     * If true, will update when focus event triggers.
     */
    triggerUpdateOnFocus: _react2.default.PropTypes.bool,
    updateWhenFocused: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.bool, 'updateWhenFocused has been renamed to triggerUpdateOnFocus')
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
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      targetOrigin: {
        vertical: 'top',
        horizontal: 'left'
      },
      animated: true,
      fullWidth: false,
      open: false,
      searchText: '',
      menuCloseDelay: 100,
      disableFocusRipple: true,
      onUpdateInput: function onUpdateInput() {},
      onNewRequest: function onNewRequest() {},
      filter: function filter(searchText, key) {
        return searchText !== '' && key.includes(searchText);
      },
      triggerUpdateOnFocus: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      searchText: this.props.searchText,
      open: this.props.open,
      anchorEl: null,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillMount: function componentWillMount() {
    this.focusOnInput = false;
    this.requestsList = [];
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.searchText !== nextProps.searchText) {
      this.setState({
        searchText: nextProps.searchText
      });
    }
  },

  componentClickAway: function componentClickAway() {
    this._close();
    this.focusOnInput = false;
  },
  _open: function _open() {
    this.setState({
      open: true,
      anchorEl: _reactDom2.default.findDOMNode(this.refs.searchTextField)
    });
  },
  _close: function _close() {
    this.setState({
      open: false,
      anchorEl: null
    });
  },
  setValue: function setValue(textValue) {
    this.setState({
      searchText: textValue
    });
  },
  getValue: function getValue() {
    return this.state.searchText;
  },
  _updateRequests: function _updateRequests(searchText) {

    this.setState({
      searchText: searchText,
      open: true,
      anchorEl: _reactDom2.default.findDOMNode(this.refs.searchTextField)
    });

    this.focusOnInput = true;

    this.props.onUpdateInput(searchText, this.props.dataSource);
  },
  _handleItemTouchTap: function _handleItemTouchTap(e, child) {
    var _this = this;

    setTimeout(function () {
      _this._close();
    }, this.props.touchTapCloseDelay);

    var dataSource = this.props.dataSource;

    var chosenRequest = undefined;
    var index = undefined;
    var searchText = undefined;
    if (typeof dataSource[0] === 'string') {
      chosenRequest = this.requestsList[parseInt(child.key, 10)];
      index = dataSource.indexOf(chosenRequest);
      searchText = dataSource[index];
    } else {
      chosenRequest = child.key;
      index = dataSource.indexOf(dataSource.filter(function (item) {
        return chosenRequest === item.text;
      })[0]);
      searchText = chosenRequest;
    }

    this.setState({ searchText: searchText });

    this.props.onNewRequest(chosenRequest, index, dataSource);
  },
  _handleKeyDown: function _handleKeyDown(e) {
    switch (e.keyCode) {
      case _keyCode2.default.ESC:
        this._close();
        break;
      case _keyCode2.default.DOWN:
        if (this.focusOnInput && this.state.open) {
          e.preventDefault();
          this.focusOnInput = false;
          this._open();
        }
        break;
      default:
        break;
    }
  },
  render: function render() {
    var _this2 = this;

    var _props = this.props;
    var anchorOrigin = _props.anchorOrigin;
    var animated = _props.animated;
    var style = _props.style;
    var errorStyle = _props.errorStyle;
    var floatingLabelText = _props.floatingLabelText;
    var hintText = _props.hintText;
    var fullWidth = _props.fullWidth;
    var menuStyle = _props.menuStyle;
    var menuProps = _props.menuProps;
    var listStyle = _props.listStyle;
    var targetOrigin = _props.targetOrigin;

    var other = _objectWithoutProperties(_props, ['anchorOrigin', 'animated', 'style', 'errorStyle', 'floatingLabelText', 'hintText', 'fullWidth', 'menuStyle', 'menuProps', 'listStyle', 'targetOrigin']);

    var _state = this.state;
    var open = _state.open;
    var anchorEl = _state.anchorEl;

    var styles = {
      root: {
        display: 'inline-block',
        position: 'relative',
        width: this.props.fullWidth ? '100%' : 256
      },
      input: {},
      error: {},
      menu: {
        width: '100%'
      },
      list: {
        display: 'block',
        width: this.props.fullWidth ? '100%' : 256
      }
    };

    var textFieldProps = {
      style: this.mergeStyles(styles.input, style),
      floatingLabelText: floatingLabelText,
      hintText: !hintText && !floatingLabelText ? '' : hintText,
      fullWidth: true,
      multiLine: false,
      errorStyle: this.mergeStyles(styles.error, errorStyle)
    };

    var mergedRootStyles = this.mergeStyles(styles.root, style);
    var mergedMenuStyles = this.mergeStyles(styles.menu, menuStyle);

    var requestsList = [];

    this.props.dataSource.map(function (item) {
      //showAllItems is deprecated, will be removed in the future
      if (_this2.props.showAllItems) {
        requestsList.push(item);
        return;
      }

      switch (typeof item === 'undefined' ? 'undefined' : _typeof(item)) {
        case 'string':
          if (_this2.props.filter(_this2.state.searchText, item, item)) {
            requestsList.push(item);
          }
          break;
        case 'object':
          if (typeof item.text === 'string') {
            if (_this2.props.filter(_this2.state.searchText, item.text, item)) {
              requestsList.push(item);
            }
          }
          break;
      }
    });

    this.requestsList = requestsList;

    var menu = open && requestsList.length > 0 ? _react2.default.createElement(
      _menu2.default,
      _extends({}, menuProps, {
        ref: 'menu',
        key: 'dropDownMenu',
        autoWidth: false,
        onEscKeyDown: this._close,
        initiallyKeyboardFocused: false,
        onItemTouchTap: this._handleItemTouchTap,
        listStyle: this.mergeStyles(styles.list, listStyle),
        style: mergedMenuStyles
      }),
      requestsList.map(function (request, index) {
        switch (typeof request === 'undefined' ? 'undefined' : _typeof(request)) {
          case 'string':
            return _react2.default.createElement(_menuItem2.default, {
              disableFocusRipple: _this2.props.disableFocusRipple,
              innerDivStyle: { overflow: 'hidden' },
              key: index,
              value: request,
              primaryText: request
            });
          case 'object':
            if (typeof request.text === 'string') {
              return _react2.default.cloneElement(request.value, {
                key: request.text,
                disableFocusRipple: _this2.props.disableFocusRipple
              });
            }
            return _react2.default.cloneElement(request, {
              key: index,
              disableFocusRipple: _this2.props.disableFocusRipple
            });
          default:
            return null;
        }
      })
    ) : null;

    var popoverStyle = undefined;
    if (anchorEl && fullWidth) {
      popoverStyle = { width: anchorEl.clientWidth };
    }

    return _react2.default.createElement(
      'div',
      {
        style: this.prepareStyles(mergedRootStyles),
        onKeyDown: this._handleKeyDown
      },
      _react2.default.createElement(
        'div',
        {
          style: {
            width: '100%'
          }
        },
        _react2.default.createElement(_textField2.default, _extends({}, other, {
          ref: 'searchTextField',
          value: this.state.searchText,
          onEnterKeyDown: function onEnterKeyDown() {
            setTimeout(function () {
              _this2._close();
            }, _this2.props.touchTapCloseDelay);
            _this2.props.onNewRequest(_this2.state.searchText);
          },
          onChange: function onChange(e) {
            var searchText = e.target.value;
            _this2._updateRequests(searchText);
          },
          onBlur: function onBlur() {
            if (_this2.focusOnInput && open) _this2.refs.searchTextField.focus();
          },
          onFocus: function onFocus() {
            if (!open && (_this2.props.triggerUpdateOnFocus || _this2.props.updateWhenFocused //this line will be removed in the future
             || _this2.requestsList > 0)) {
              _this2._updateRequests(_this2.state.searchText);
            }
            _this2.focusOnInput = true;
          }

        }, textFieldProps))
      ),
      _react2.default.createElement(
        _popover2.default,
        {
          style: popoverStyle,
          anchorOrigin: anchorOrigin,
          targetOrigin: targetOrigin,
          open: open,
          anchorEl: anchorEl,
          useLayerForClickAway: false,
          onRequestClose: this._close
        },
        menu
      )
    );
  }
});

AutoComplete.levenshteinDistance = function (searchText, key) {
  var current = [];
  var prev = undefined;
  var value = undefined;

  for (var i = 0; i <= key.length; i++) {
    for (var j = 0; j <= searchText.length; j++) {
      if (i && j) {
        if (searchText.charAt(j - 1) === key.charAt(i - 1)) value = prev;else value = Math.min(current[j], current[j - 1], prev) + 1;
      } else {
        value = i + j;
      }
      prev = current[j];
      current[j] = value;
    }
  }
  return current.pop();
};

AutoComplete.noFilter = function () {
  return true;
};

AutoComplete.defaultFilter = AutoComplete.caseSensitiveFilter = function (searchText, key) {
  return searchText !== '' && key.includes(searchText);
};

AutoComplete.caseInsensitiveFilter = function (searchText, key) {
  return key.toLowerCase().includes(searchText.toLowerCase());
};

AutoComplete.levenshteinDistanceFilter = function (distanceLessThan) {
  if (distanceLessThan === undefined) return AutoComplete.levenshteinDistance;else if (typeof distanceLessThan !== 'number') {
    throw 'Error: AutoComplete.levenshteinDistanceFilter is a filter generator, not a filter!';
  }
  return function (s, k) {
    return AutoComplete.levenshteinDistance(s, k) < distanceLessThan;
  };
};

AutoComplete.fuzzyFilter = function (searchText, key) {
  if (searchText.length === 0) return false;
  var subMatchKey = key.substring(0, searchText.length);
  var distance = AutoComplete.levenshteinDistance(searchText.toLowerCase(), subMatchKey.toLowerCase());
  return searchText.length > 3 ? distance < 2 : distance === 0;
};

AutoComplete.Item = _menuItem2.default;
AutoComplete.Divider = _divider2.default;

exports.default = AutoComplete;
module.exports = exports['default'];