'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _autoPrefix = require('./styles/auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _paper = require('./paper');

var _paper2 = _interopRequireDefault(_paper);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VIEWBOX_SIZE = 32;
var RefreshIndicator = _react2.default.createClass({
  displayName: 'RefreshIndicator',

  propTypes: {
    /**
     * Override the theme's color of the indicator while it's status is
     * "ready" and it's percentage is less than 100.
     */
    color: _react2.default.PropTypes.string,

    /**
     * The absolute left position of the indicator in pixels.
     */
    left: _react2.default.PropTypes.number.isRequired,

    /**
     * Override the theme's color of the indicator while
     * it's status is "loading" or when it's percentage is 100.
     */
    loadingColor: _react2.default.PropTypes.string,

    /**
     * The confirmation progress to fetch data. Max value is 100.
     */
    percentage: _react2.default.PropTypes.number,

    /**
     * Size in pixels.
     */
    size: _react2.default.PropTypes.number,

    /**
     * The display status of the indicator. If the status is
     * "ready", the indicator will display the ready state
     * arrow. If the status is "loading", it will display
     * the loading progress indicator. If the status is "hide",
     * the indicator will be hidden.
     */
    status: _react2.default.PropTypes.oneOf(['ready', 'loading', 'hide']),

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The absolute top position of the indicator in pixels.
     */
    top: _react2.default.PropTypes.number.isRequired
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
      percentage: 0,
      size: 40,
      status: 'hide'
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
  componentDidMount: function componentDidMount() {
    this.componentDidUpdate();
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },
  componentDidUpdate: function componentDidUpdate() {
    this._scalePath(_reactDom2.default.findDOMNode(this.refs.path), 0);
    this._rotateWrapper(_reactDom2.default.findDOMNode(this.refs.wrapper));
  },
  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.scalePathTimer);
    clearTimeout(this.rotateWrapperTimer);
    clearTimeout(this.rotateWrapperSecondTimer);
  },

  scalePathTimer: undefined,
  rotateWrapperTimer: undefined,
  rotateWrapperSecondTimer: undefined,

  _renderChildren: function _renderChildren() {
    var paperSize = this._getPaperSize();
    var childrenCmp = null;
    if (this.props.status !== 'ready') {
      var circleStyle = this._getCircleStyle(paperSize);
      childrenCmp = _react2.default.createElement(
        'div',
        { ref: 'wrapper', style: this.prepareStyles({
            transition: _transitions2.default.create('transform', '20s', null, 'linear'),
            width: '100%',
            height: '100%'
          })
        },
        _react2.default.createElement(
          'svg',
          { style: {
              width: paperSize,
              height: paperSize
            },
            viewBox: '0 0 ' + VIEWBOX_SIZE + ' ' + VIEWBOX_SIZE
          },
          _react2.default.createElement('circle', _extends({ ref: 'path',
            style: this.prepareStyles(circleStyle.style, {
              transition: _transitions2.default.create('all', '1.5s', null, 'ease-in-out')
            })
          }, circleStyle.attr))
        )
      );
    } else {
      var circleStyle = this._getCircleStyle(paperSize);
      var polygonStyle = this._getPolygonStyle(paperSize);
      childrenCmp = _react2.default.createElement(
        'svg',
        { style: {
            width: paperSize,
            height: paperSize
          },
          viewBox: '0 0 ' + VIEWBOX_SIZE + ' ' + VIEWBOX_SIZE
        },
        _react2.default.createElement('circle', _extends({
          style: this.prepareStyles(circleStyle.style)
        }, circleStyle.attr)),
        _react2.default.createElement('polygon', _extends({
          style: this.prepareStyles(polygonStyle.style)
        }, polygonStyle.attr))
      );
    }

    return childrenCmp;
  },
  _getTheme: function _getTheme() {
    return this.state.muiTheme.refreshIndicator;
  },
  _getPaddingSize: function _getPaddingSize() {
    var padding = this.props.size * 0.1;
    return padding;
  },
  _getPaperSize: function _getPaperSize() {
    return this.props.size - this._getPaddingSize() * 2;
  },
  _getCircleAttr: function _getCircleAttr() {
    return {
      radiu: VIEWBOX_SIZE / 2 - 5,
      originX: VIEWBOX_SIZE / 2,
      originY: VIEWBOX_SIZE / 2,
      strokeWidth: 3
    };
  },
  _getArcDeg: function _getArcDeg() {
    var p = this.props.percentage / 100;

    var beginDeg = p * 120;
    var endDeg = p * 410;
    return [beginDeg, endDeg];
  },
  _getFactor: function _getFactor() {
    var p = this.props.percentage / 100;
    var p1 = Math.min(1, p / 0.4);

    return p1;
  },
  _getRootStyle: function _getRootStyle() {
    var padding = this._getPaddingSize();
    return {
      position: 'absolute',
      zIndex: 2,
      width: this.props.size,
      height: this.props.size,
      padding: padding,
      top: -10000,
      left: -10000,
      transform: 'translate3d(' + (10000 + this.props.left) + 'px, ' + (10000 + this.props.top) + 'px, 0)',
      opacity: this.props.status === 'hide' ? 0 : 1,
      transition: this.props.status === 'hide' ? _transitions2.default.create('all', '.3s', 'ease-out') : 'none'
    };
  },
  _getCircleStyle: function _getCircleStyle() {
    var isLoading = this.props.status === 'loading';
    var p1 = isLoading ? 1 : this._getFactor();
    var circle = this._getCircleAttr();
    var perimeter = Math.PI * 2 * circle.radiu;

    var _getArcDeg2 = this._getArcDeg();

    var _getArcDeg3 = _slicedToArray(_getArcDeg2, 2);

    var beginDeg = _getArcDeg3[0];
    var endDeg = _getArcDeg3[1];

    var arcLen = (endDeg - beginDeg) * perimeter / 360;
    var dashOffset = -beginDeg * perimeter / 360;

    var theme = this._getTheme();
    return {
      style: {
        strokeDasharray: arcLen + ', ' + (perimeter - arcLen),
        strokeDashoffset: dashOffset,
        stroke: isLoading || this.props.percentage === 100 ? this.props.loadingColor || theme.loadingStrokeColor : this.props.color || theme.strokeColor,
        strokeLinecap: 'round',
        opacity: p1,
        strokeWidth: circle.strokeWidth * p1,
        fill: 'none'
      },
      attr: {
        cx: circle.originX,
        cy: circle.originY,
        r: circle.radiu
      }
    };
  },
  _getPolygonStyle: function _getPolygonStyle() {
    var p1 = this._getFactor();
    var circle = this._getCircleAttr();

    var triangleCx = circle.originX + circle.radiu;
    var triangleCy = circle.originY;
    var dx = circle.strokeWidth * 7 / 4 * p1;
    var trianglePath = triangleCx - dx + ',' + triangleCy + ' ' + (triangleCx + dx) + ',' + triangleCy + ' ' + triangleCx + ',' + (triangleCy + dx);

    var _getArcDeg4 = this._getArcDeg();

    var _getArcDeg5 = _slicedToArray(_getArcDeg4, 2);

    var endDeg = _getArcDeg5[1];

    var theme = this._getTheme();
    return {
      style: {
        fill: this.props.percentage === 100 ? this.props.loadingColor || theme.loadingStrokeColor : this.props.color || theme.strokeColor,
        transform: 'rotate(' + endDeg + 'deg)',
        transformOrigin: circle.originX + 'px ' + circle.originY + 'px',
        opacity: p1
      },
      attr: {
        points: trianglePath
      }
    };
  },
  _scalePath: function _scalePath(path, step) {
    var _this = this;

    if (this.props.status !== 'loading') return;

    var currStep = (step || 0) % 3;

    var circle = this._getCircleAttr();
    var perimeter = Math.PI * 2 * circle.radiu;
    var arcLen = perimeter * 0.64;

    var strokeDasharray = undefined;
    var strokeDashoffset = undefined;
    var transitionDuration = undefined;

    if (currStep === 0) {
      strokeDasharray = '1, 200';
      strokeDashoffset = 0;
      transitionDuration = '0ms';
    } else if (currStep === 1) {
      strokeDasharray = arcLen + ', 200';
      strokeDashoffset = -15;
      transitionDuration = '750ms';
    } else {
      strokeDasharray = arcLen + ',200';
      strokeDashoffset = -(perimeter - 1);
      transitionDuration = '850ms';
    }

    _autoPrefix2.default.set(path.style, 'strokeDasharray', strokeDasharray, this.state.muiTheme);
    _autoPrefix2.default.set(path.style, 'strokeDashoffset', strokeDashoffset, this.state.muiTheme);
    _autoPrefix2.default.set(path.style, 'transitionDuration', transitionDuration, this.state.muiTheme);

    this.scalePathTimer = setTimeout(function () {
      return _this._scalePath(path, currStep + 1);
    }, currStep ? 750 : 250);
  },
  _rotateWrapper: function _rotateWrapper(wrapper) {
    var _this2 = this;

    if (this.props.status !== 'loading') return;

    _autoPrefix2.default.set(wrapper.style, 'transform', null, this.state.muiTheme);
    _autoPrefix2.default.set(wrapper.style, 'transform', 'rotate(0deg)', this.state.muiTheme);
    _autoPrefix2.default.set(wrapper.style, 'transitionDuration', '0ms', this.state.muiTheme);

    this.rotateWrapperSecondTimer = setTimeout(function () {
      _autoPrefix2.default.set(wrapper.style, 'transform', 'rotate(1800deg)', _this2.state.muiTheme);
      _autoPrefix2.default.set(wrapper.style, 'transitionDuration', '10s', _this2.state.muiTheme);
      _autoPrefix2.default.set(wrapper.style, 'transitionTimingFunction', 'linear', _this2.state.muiTheme);
    }, 50);

    this.rotateWrapperTimer = setTimeout(function () {
      return _this2._rotateWrapper(wrapper);
    }, 10050);
  },
  render: function render() {
    var rootStyle = this._getRootStyle();
    return _react2.default.createElement(
      _paper2.default,
      {
        circle: true,
        style: this.mergeStyles(rootStyle, this.props.style),
        ref: 'indicatorCt'
      },
      this._renderChildren()
    );
  }
});

exports.default = RefreshIndicator;
module.exports = exports['default'];