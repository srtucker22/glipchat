'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _dom = require('../utils/dom');

var _dom2 = _interopRequireDefault(_dom);

var _circleRipple = require('./circle-ripple');

var _circleRipple2 = _interopRequireDefault(_circleRipple);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function push(array, obj) {
  var newObj = Array.isArray(obj) ? obj : [obj];
  return (0, _reactAddonsUpdate2.default)(array, { $push: newObj });
}

function shift(array) {
  return (0, _reactAddonsUpdate2.default)(array, { $splice: [[0, 1]] });
}

var TouchRipple = _react2.default.createClass({
  displayName: 'TouchRipple',

  propTypes: {
    centerRipple: _react2.default.PropTypes.bool,
    children: _react2.default.PropTypes.node,
    color: _react2.default.PropTypes.string,

    /**
     * The material-ui theme applied to this component.
     */
    muiTheme: _react2.default.PropTypes.object.isRequired,

    opacity: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
  },

  mixins: [_reactAddonsPureRenderMixin2.default, _stylePropable2.default],

  getInitialState: function getInitialState() {
    //Touch start produces a mouse down event for compat reasons. To avoid
    //showing ripples twice we skip showing a ripple for the first mouse down
    //after a touch start. Note we don't store ignoreNextMouseDown in this.state
    //to avoid re-rendering when we change it
    this._ignoreNextMouseDown = false;

    return {
      //This prop allows us to only render the ReactTransitionGroup
      //on the first click of the component, making the inital
      //render faster
      hasRipples: false,
      nextKey: 0,
      ripples: []
    };
  },
  start: function start(e, isRippleTouchGenerated) {
    if (this._ignoreNextMouseDown && !isRippleTouchGenerated) {
      this._ignoreNextMouseDown = false;
      return;
    }

    var ripples = this.state.ripples;

    //Add a ripple to the ripples array
    ripples = push(ripples, _react2.default.createElement(_circleRipple2.default, {
      key: this.state.nextKey,
      muiTheme: this.props.muiTheme,
      style: !this.props.centerRipple ? this._getRippleStyle(e) : {},
      color: this.props.color,
      opacity: this.props.opacity,
      touchGenerated: isRippleTouchGenerated
    }));

    this._ignoreNextMouseDown = isRippleTouchGenerated;
    this.setState({
      hasRipples: true,
      nextKey: this.state.nextKey + 1,
      ripples: ripples
    });
  },
  end: function end() {
    var currentRipples = this.state.ripples;
    this.setState({
      ripples: shift(currentRipples)
    });
  },
  _handleMouseDown: function _handleMouseDown(e) {
    //only listen to left clicks
    if (e.button === 0) this.start(e, false);
  },
  _handleMouseUp: function _handleMouseUp() {
    this.end();
  },
  _handleMouseLeave: function _handleMouseLeave() {
    this.end();
  },
  _handleTouchStart: function _handleTouchStart(e) {
    this.start(e, true);
  },
  _handleTouchEnd: function _handleTouchEnd() {
    this.end();
  },
  _getRippleStyle: function _getRippleStyle(e) {
    var style = {};
    var el = _reactDom2.default.findDOMNode(this);
    var elHeight = el.offsetHeight;
    var elWidth = el.offsetWidth;
    var offset = _dom2.default.offset(el);
    var isTouchEvent = e.touches && e.touches.length;
    var pageX = isTouchEvent ? e.touches[0].pageX : e.pageX;
    var pageY = isTouchEvent ? e.touches[0].pageY : e.pageY;
    var pointerX = pageX - offset.left;
    var pointerY = pageY - offset.top;
    var topLeftDiag = this._calcDiag(pointerX, pointerY);
    var topRightDiag = this._calcDiag(elWidth - pointerX, pointerY);
    var botRightDiag = this._calcDiag(elWidth - pointerX, elHeight - pointerY);
    var botLeftDiag = this._calcDiag(pointerX, elHeight - pointerY);
    var rippleRadius = Math.max(topLeftDiag, topRightDiag, botRightDiag, botLeftDiag);
    var rippleSize = rippleRadius * 2;
    var left = pointerX - rippleRadius;
    var top = pointerY - rippleRadius;

    style.height = rippleSize + 'px';
    style.width = rippleSize + 'px';
    style.top = top + 'px';
    style.left = left + 'px';

    return style;
  },
  _calcDiag: function _calcDiag(a, b) {
    return Math.sqrt(a * a + b * b);
  },
  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var style = _props.style;
    var _state = this.state;
    var hasRipples = _state.hasRipples;
    var ripples = _state.ripples;

    var rippleGroup = undefined;
    if (hasRipples) {
      var mergedStyles = this.mergeStyles({
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }, style);

      rippleGroup = _react2.default.createElement(
        _reactAddonsTransitionGroup2.default,
        { style: this.prepareStyles(mergedStyles) },
        ripples
      );
    }

    return _react2.default.createElement(
      'div',
      {
        onMouseUp: this._handleMouseUp,
        onMouseDown: this._handleMouseDown,
        onMouseLeave: this._handleMouseLeave,
        onTouchStart: this._handleTouchStart,
        onTouchEnd: this._handleTouchEnd
      },
      rippleGroup,
      children
    );
  }
});

exports.default = TouchRipple;
module.exports = exports['default'];