'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _autoPrefix = require('../styles/auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var SlideInChild = _react2.default.createClass({
  displayName: 'SlideInChild',

  propTypes: {
    children: _react2.default.PropTypes.node,
    direction: _react2.default.PropTypes.string,
    enterDelay: _react2.default.PropTypes.number,
    //This callback is needed bacause
    //the direction could change when leaving the dom
    getLeaveDirection: _react2.default.PropTypes.func.isRequired,

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
      enterDelay: 0
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
  componentWillEnter: function componentWillEnter(callback) {
    var _this = this;

    var style = _reactDom2.default.findDOMNode(this).style;
    var x = this.props.direction === 'left' ? '100%' : this.props.direction === 'right' ? '-100%' : '0';
    var y = this.props.direction === 'up' ? '100%' : this.props.direction === 'down' ? '-100%' : '0';

    style.opacity = '0';
    _autoPrefix2.default.set(style, 'transform', 'translate3d(' + x + ',' + y + ',0)', this.state.muiTheme);

    setTimeout(function () {
      if (_this.isMounted()) callback();
    }, this.props.enterDelay);
  },
  componentDidEnter: function componentDidEnter() {
    var style = _reactDom2.default.findDOMNode(this).style;
    style.opacity = '1';
    _autoPrefix2.default.set(style, 'transform', 'translate3d(0,0,0)', this.state.muiTheme);
  },
  componentWillLeave: function componentWillLeave(callback) {
    var _this2 = this;

    var style = _reactDom2.default.findDOMNode(this).style;
    var direction = this.props.getLeaveDirection();
    var x = direction === 'left' ? '-100%' : direction === 'right' ? '100%' : '0';
    var y = direction === 'up' ? '-100%' : direction === 'down' ? '100%' : '0';

    style.opacity = '0';
    _autoPrefix2.default.set(style, 'transform', 'translate3d(' + x + ',' + y + ',0)', this.state.muiTheme);

    setTimeout(function () {
      if (_this2.isMounted()) callback();
    }, 450);
  },
  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var enterDelay = _props.enterDelay;
    var getLeaveDirection = _props.getLeaveDirection;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['children', 'enterDelay', 'getLeaveDirection', 'style']);

    var mergedRootStyles = this.mergeStyles({
      position: 'absolute',
      height: '100%',
      width: '100%',
      top: 0,
      left: 0,
      transition: _transitions2.default.easeOut(null, ['transform', 'opacity'])
    }, style);

    return _react2.default.createElement(
      'div',
      _extends({}, other, { style: this.prepareStyles(mergedRootStyles) }),
      children
    );
  }
});

exports.default = SlideInChild;
module.exports = exports['default'];