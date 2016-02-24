'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _windowListenable = require('../mixins/window-listenable');

var _windowListenable2 = _interopRequireDefault(_windowListenable);

var _renderToLayer = require('../render-to-layer');

var _renderToLayer2 = _interopRequireDefault(_renderToLayer);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _propTypes = require('../utils/prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _paper = require('../paper');

var _paper2 = _interopRequireDefault(_paper);

var _lodash = require('lodash.throttle');

var _lodash2 = _interopRequireDefault(_lodash);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _popoverDefaultAnimation = require('./popover-default-animation');

var _popoverDefaultAnimation2 = _interopRequireDefault(_popoverDefaultAnimation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Popover = _react2.default.createClass({
  displayName: 'Popover',

  propTypes: {
    /**
     * This is the DOM element that will be used to set the position of the
     * component.
     */
    anchorEl: _react2.default.PropTypes.object,

    /**
     * This is the point on the anchor where the popover
     * targetOrigin will stick to.
     * Options:
     * vertical: [top, middle, bottom]
     * horizontal: [left, center, right]
     */
    anchorOrigin: _propTypes2.default.origin,

    /**
     * If true, the popover will apply transitions when
     * added it gets added to the DOM.
     */
    animated: _react2.default.PropTypes.bool,

    /**
     * Override the default animation component used.
     */
    animation: _react2.default.PropTypes.func,

    /**
     * If true, the popover will hide when the anchor scrolls off the screen
     */
    autoCloseWhenOffScreen: _react2.default.PropTypes.bool,

    /**
     * If true, the popover (potentially) ignores targetOrigin
     * and anchorOrigin to make itself fit on screen,
     * which is useful for mobile devices.
     */
    canAutoPosition: _react2.default.PropTypes.bool,

    /**
     * Use this property to render your component inside the `Popover`.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * This is a callback that fires when the popover
     * thinks it should close. (e.g. clickAway or offScreen)
     *
     * @param {string} reason Determines what triggered this request.
     */
    onRequestClose: _react2.default.PropTypes.func,

    /**
     * Controls the visibility of the popover.
     */
    open: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * This is the point on the popover which will stick to
     * the anchors origin.
     * Options:
     * vertical: [top, middle, bottom]
     * horizontal: [left, center, right]
     */
    targetOrigin: _propTypes2.default.origin,

    /**
     * If true, the popover will render on top of an invisible
     * layer, which will prevent clicks to the underlying
     * elements, and trigger an onRequestClose(clickAway) event.
     */
    useLayerForClickAway: _react2.default.PropTypes.bool,

    /**
     * This number represents the zDepth of the paper shadow.
     */
    zDepth: _propTypes2.default.zDepth
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
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'left'
      },
      animated: true,
      autoCloseWhenOffScreen: true,
      canAutoPosition: true,
      onRequestClose: function onRequestClose() {},
      open: false,
      style: {
        overflowY: 'auto'
      },
      targetOrigin: {
        vertical: 'top',
        horizontal: 'left'
      },
      useLayerForClickAway: true,
      zDepth: 1
    };
  },
  getInitialState: function getInitialState() {
    this.setPlacementThrottled = (0, _lodash2.default)(this.setPlacement, 100);
    this.setPlacementThrottledScrolled = (0, _lodash2.default)(this.setPlacement.bind(this, true), 100);

    return {
      open: this.props.open,
      closing: false,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var _this = this;

    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    if (nextProps.open !== this.state.open) {
      if (nextProps.open) {
        this.anchorEl = nextProps.anchorEl || this.props.anchorEl;
        this.setState({
          open: true,
          closing: false,
          muiTheme: newMuiTheme
        });
      } else {
        if (nextProps.animated) {
          this.setState({ closing: true });
          this._timeout = setTimeout(function () {
            if (_this.isMounted()) {
              _this.setState({
                open: false,
                muiTheme: newMuiTheme
              });
            }
          }, 500);
        } else {
          this.setState({
            open: false,
            muiTheme: newMuiTheme
          });
        }
      }
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    this.setPlacement();
  },

  windowListeners: {
    resize: 'setPlacementThrottled',
    scroll: 'setPlacementThrottledScrolled'
  },

  renderLayer: function renderLayer() {
    var _props = this.props;
    var animated = _props.animated;
    var animation = _props.animation;
    var children = _props.children;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['animated', 'animation', 'children', 'style']);

    var Animation = animation || _popoverDefaultAnimation2.default;

    if (!Animation) {
      Animation = _paper2.default;
      style = {
        position: 'fixed'
      };
      if (!this.state.open) {
        return null;
      }
    }

    return _react2.default.createElement(
      Animation,
      _extends({}, other, { style: style, open: this.state.open && !this.state.closing }),
      children
    );
  },
  requestClose: function requestClose(reason) {
    if (this.props.onRequestClose) {
      this.props.onRequestClose(reason);
    }
  },
  componentClickAway: function componentClickAway() {
    this.requestClose('clickAway');
  },
  _resizeAutoPosition: function _resizeAutoPosition() {
    this.setPlacement();
  },
  getAnchorPosition: function getAnchorPosition(el) {
    if (!el) {
      el = _reactDom2.default.findDOMNode(this);
    }

    var rect = el.getBoundingClientRect();
    var a = {
      top: rect.top,
      left: rect.left,
      width: el.offsetWidth,
      height: el.offsetHeight
    };

    a.right = rect.right || a.left + a.width;
    a.bottom = rect.bottom || a.top + a.height;
    a.middle = a.left + (a.right - a.left) / 2;
    a.center = a.top + (a.bottom - a.top) / 2;

    return a;
  },
  getTargetPosition: function getTargetPosition(targetEl) {
    return {
      top: 0,
      center: targetEl.offsetHeight / 2,
      bottom: targetEl.offsetHeight,
      left: 0,
      middle: targetEl.offsetWidth / 2,
      right: targetEl.offsetWidth
    };
  },
  setPlacement: function setPlacement(scrolling) {
    if (!this.state.open) {
      return;
    }

    var anchorEl = this.props.anchorEl || this.anchorEl;

    if (!this.refs.layer.getLayer()) {
      return;
    }

    var targetEl = this.refs.layer.getLayer().children[0];
    if (!targetEl) {
      return;
    }

    var _props2 = this.props;
    var targetOrigin = _props2.targetOrigin;
    var anchorOrigin = _props2.anchorOrigin;

    var anchor = this.getAnchorPosition(anchorEl);
    var target = this.getTargetPosition(targetEl);

    var targetPosition = {
      top: anchor[anchorOrigin.vertical] - target[targetOrigin.vertical],
      left: anchor[anchorOrigin.horizontal] - target[targetOrigin.horizontal]
    };

    if (scrolling && this.props.autoCloseWhenOffScreen) {
      this.autoCloseWhenOffScreen(anchor);
    }

    if (this.props.canAutoPosition) {
      target = this.getTargetPosition(targetEl); // update as height may have changed
      targetPosition = this.applyAutoPositionIfNeeded(anchor, target, targetOrigin, anchorOrigin, targetPosition);
    }

    targetEl.style.top = Math.max(0, targetPosition.top) + 'px';
    targetEl.style.left = Math.max(0, targetPosition.left) + 'px';
    targetEl.style.maxHeight = window.innerHeight + 'px';
  },
  autoCloseWhenOffScreen: function autoCloseWhenOffScreen(anchorPosition) {
    if (anchorPosition.top < 0 || anchorPosition.top > window.innerHeight || anchorPosition.left < 0 || anchorPosition.left > window.innerWith) {
      this.requestClose('offScreen');
    }
  },
  getOverlapMode: function getOverlapMode(anchor, target, median) {
    if ([anchor, target].indexOf(median) >= 0) return 'auto';
    if (anchor === target) return 'inclusive';
    return 'exclusive';
  },
  getPositions: function getPositions(anchor, target) {
    var a = _extends({}, anchor);
    var t = _extends({}, target);

    var positions = {
      x: ['left', 'right'].filter(function (p) {
        return p !== t.horizontal;
      }),
      y: ['top', 'bottom'].filter(function (p) {
        return p !== t.vertical;
      })
    };

    var overlap = {
      x: this.getOverlapMode(a.horizontal, t.horizontal, 'middle'),
      y: this.getOverlapMode(a.vertical, t.vertical, 'center')
    };

    positions.x.splice(overlap.x === 'auto' ? 0 : 1, 0, 'middle');
    positions.y.splice(overlap.y === 'auto' ? 0 : 1, 0, 'center');

    if (overlap.y !== 'auto') {
      a.vertical = a.vertical === 'top' ? 'bottom' : 'top';
      if (overlap.y === 'inclusive') {
        t.vertical = t.vertical;
      }
    }

    if (overlap.x !== 'auto') {
      a.horizontal = a.horizontal === 'left' ? 'right' : 'left';
      if (overlap.y === 'inclusive') {
        t.horizontal = t.horizontal;
      }
    }

    return {
      positions: positions,
      anchorPos: a
    };
  },
  applyAutoPositionIfNeeded: function applyAutoPositionIfNeeded(anchor, target, targetOrigin, anchorOrigin, targetPosition) {
    var _getPositions = this.getPositions(anchorOrigin, targetOrigin);

    var positions = _getPositions.positions;
    var anchorPos = _getPositions.anchorPos;

    if (targetPosition.top < 0 || targetPosition.top + target.bottom > window.innerHeight) {
      var newTop = anchor[anchorPos.vertical] - target[positions.y[0]];
      if (newTop + target.bottom <= window.innerHeight) targetPosition.top = Math.max(0, newTop);else {
        newTop = anchor[anchorPos.vertical] - target[positions.y[1]];
        if (newTop + target.bottom <= window.innerHeight) targetPosition.top = Math.max(0, newTop);
      }
    }
    if (targetPosition.left < 0 || targetPosition.left + target.right > window.innerWidth) {
      var newLeft = anchor[anchorPos.horizontal] - target[positions.x[0]];
      if (newLeft + target.right <= window.innerWidth) targetPosition.left = Math.max(0, newLeft);else {
        newLeft = anchor[anchorPos.horizontal] - target[positions.x[1]];
        if (newLeft + target.right <= window.innerWidth) targetPosition.left = Math.max(0, newLeft);
      }
    }
    return targetPosition;
  },
  render: function render() {
    return _react2.default.createElement(_renderToLayer2.default, {
      ref: 'layer',
      open: this.state.open,
      componentClickAway: this.componentClickAway,
      useLayerForClickAway: this.props.useLayerForClickAway,
      render: this.renderLayer
    });
  }
});

exports.default = Popover;
module.exports = exports['default'];