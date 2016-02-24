'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _slideInChild = require('./slide-in-child');

var _slideInChild2 = _interopRequireDefault(_slideInChild);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var SlideIn = _react2.default.createClass({
  displayName: 'SlideIn',

  propTypes: {
    childStyle: _react2.default.PropTypes.object,
    children: _react2.default.PropTypes.node,
    direction: _react2.default.PropTypes.oneOf(['left', 'right', 'up', 'down']),
    enterDelay: _react2.default.PropTypes.number,

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
      enterDelay: 0,
      direction: 'left'
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
  _getLeaveDirection: function _getLeaveDirection() {
    return this.props.direction;
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var enterDelay = _props.enterDelay;
    var children = _props.children;
    var childStyle = _props.childStyle;
    var direction = _props.direction;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['enterDelay', 'children', 'childStyle', 'direction', 'style']);

    var mergedRootStyles = this.mergeStyles({
      position: 'relative',
      overflow: 'hidden',
      height: '100%'
    }, style);

    var newChildren = _react2.default.Children.map(children, function (child) {
      return _react2.default.createElement(
        _slideInChild2.default,
        {
          key: child.key,
          direction: direction,
          enterDelay: enterDelay,
          getLeaveDirection: _this._getLeaveDirection,
          style: childStyle
        },
        child
      );
    }, this);

    return _react2.default.createElement(
      _reactAddonsTransitionGroup2.default,
      _extends({}, other, {
        style: this.prepareStyles(mergedRootStyles),
        component: 'div'
      }),
      newChildren
    );
  }
});

exports.default = SlideIn;
module.exports = exports['default'];