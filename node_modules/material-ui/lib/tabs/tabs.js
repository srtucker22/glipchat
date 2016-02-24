'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _tabTemplate = require('./tabTemplate');

var _tabTemplate2 = _interopRequireDefault(_tabTemplate);

var _inkBar = require('../ink-bar');

var _inkBar2 = _interopRequireDefault(_inkBar);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Tabs = _react2.default.createClass({
  displayName: 'Tabs',

  propTypes: {
    /**
     * Should be used to pass `Tab` components.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * The css class name of the content's container.
     */
    contentContainerClassName: _react2.default.PropTypes.string,

    /**
     * Override the inline-styles of the content's container.
     */
    contentContainerStyle: _react2.default.PropTypes.object,

    /**
     * Specify initial visible tab index.
     * Initial selected index is set by default to 0.
     * If initialSelectedIndex is set but larger than the total amount of specified tabs,
     * initialSelectedIndex will revert back to default.
     */
    initialSelectedIndex: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the InkBar.
     */
    inkBarStyle: _react2.default.PropTypes.object,

    /**
     * Called when the selected value change.
     */
    onChange: _react2.default.PropTypes.func,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of the tab-labels container.
     */
    tabItemContainerStyle: _react2.default.PropTypes.object,

    /**
     * Override the default tab template used to wrap the content of each tab element.
     */
    tabTemplate: _react2.default.PropTypes.func,

    /**
     * Makes Tabs controllable and selects the tab whose value prop matches this prop.
     */
    value: _react2.default.PropTypes.any
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      initialSelectedIndex: 0,
      onChange: function onChange() {}
    };
  },
  getInitialState: function getInitialState() {
    var valueLink = this.getValueLink(this.props);
    var initialIndex = this.props.initialSelectedIndex;

    return {
      selectedIndex: valueLink.value !== undefined ? this._getSelectedIndex(this.props) : initialIndex < this.getTabCount() ? initialIndex : 0,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(newProps, nextContext) {
    var valueLink = this.getValueLink(newProps);
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    if (valueLink.value !== undefined) {
      this.setState({ selectedIndex: this._getSelectedIndex(newProps) });
    }

    this.setState({ muiTheme: newMuiTheme });
  },
  getEvenWidth: function getEvenWidth() {
    return parseInt(window.getComputedStyle(_reactDom2.default.findDOMNode(this)).getPropertyValue('width'), 10);
  },
  getTabCount: function getTabCount() {
    return _react2.default.Children.count(this.props.children);
  },

  // Do not use outside of this component, it will be removed once valueLink is deprecated
  getValueLink: function getValueLink(props) {
    return props.valueLink || {
      value: props.value,
      requestChange: props.onChange
    };
  },
  _getSelectedIndex: function _getSelectedIndex(props) {
    var valueLink = this.getValueLink(props);
    var selectedIndex = -1;

    _react2.default.Children.forEach(props.children, function (tab, index) {
      if (valueLink.value === tab.props.value) {
        selectedIndex = index;
      }
    });

    return selectedIndex;
  },
  _handleTabTouchTap: function _handleTabTouchTap(value, e, tab) {
    var valueLink = this.getValueLink(this.props);
    var tabIndex = tab.props.tabIndex;

    if (valueLink.value && valueLink.value !== value || this.state.selectedIndex !== tabIndex) {
      valueLink.requestChange(value, e, tab);
    }

    this.setState({ selectedIndex: tabIndex });

    if (tab.props.onActive) {
      tab.props.onActive(tab);
    }
  },
  _getSelected: function _getSelected(tab, index) {
    var valueLink = this.getValueLink(this.props);
    return valueLink.value ? valueLink.value === tab.props.value : this.state.selectedIndex === index;
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var children = _props.children;
    var contentContainerClassName = _props.contentContainerClassName;
    var contentContainerStyle = _props.contentContainerStyle;
    var initialSelectedIndex = _props.initialSelectedIndex;
    var inkBarStyle = _props.inkBarStyle;
    var style = _props.style;
    var tabItemContainerStyle = _props.tabItemContainerStyle;
    var tabTemplate = _props.tabTemplate;

    var other = _objectWithoutProperties(_props, ['children', 'contentContainerClassName', 'contentContainerStyle', 'initialSelectedIndex', 'inkBarStyle', 'style', 'tabItemContainerStyle', 'tabTemplate']);

    var themeVariables = this.state.muiTheme.tabs;
    var styles = {
      tabItemContainer: {
        margin: 0,
        padding: 0,
        width: '100%',
        backgroundColor: themeVariables.backgroundColor,
        whiteSpace: 'nowrap'
      }
    };

    var valueLink = this.getValueLink(this.props);
    var tabValue = valueLink.value;
    var tabContent = [];

    var width = 100 / this.getTabCount();

    var tabs = _react2.default.Children.map(children, function (tab, index) {
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(tab.type && tab.type.displayName === 'Tab', 'Tabs only accepts Tab Components as children.\n        Found ' + (tab.type.displayName || tab.type) + ' as child number ' + (index + 1) + ' of Tabs') : undefined;

      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!tabValue || tab.props.value !== undefined, 'Tabs value prop has been passed, but Tab ' + index + '\n        does not have a value prop. Needs value if Tabs is going\n        to be a controlled component.') : undefined;

      tabContent.push(tab.props.children ? _react2.default.createElement(tabTemplate || _tabTemplate2.default, {
        key: index,
        selected: _this._getSelected(tab, index)
      }, tab.props.children) : undefined);

      return _react2.default.cloneElement(tab, {
        key: index,
        selected: _this._getSelected(tab, index),
        tabIndex: index,
        width: width + '%',
        onTouchTap: _this._handleTabTouchTap
      });
    });

    var inkBar = this.state.selectedIndex !== -1 ? _react2.default.createElement(_inkBar2.default, {
      left: width * this.state.selectedIndex + '%',
      width: width + '%',
      style: inkBarStyle
    }) : null;

    var inkBarContainerWidth = tabItemContainerStyle ? tabItemContainerStyle.width : '100%';

    return _react2.default.createElement(
      'div',
      _extends({}, other, {
        style: this.prepareStyles(style)
      }),
      _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.tabItemContainer, tabItemContainerStyle) },
        tabs
      ),
      _react2.default.createElement(
        'div',
        { style: { width: inkBarContainerWidth } },
        inkBar
      ),
      _react2.default.createElement(
        'div',
        {
          style: this.prepareStyles(contentContainerStyle),
          className: contentContainerClassName
        },
        tabContent
      )
    );
  }
});

exports.default = Tabs;
module.exports = exports['default'];