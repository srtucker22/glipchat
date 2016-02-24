'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _clockNumber = require('./clock-number');

var _clockNumber2 = _interopRequireDefault(_clockNumber);

var _clockPointer = require('./clock-pointer');

var _clockPointer2 = _interopRequireDefault(_clockPointer);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rad2deg(rad) {
  return rad * 57.29577951308232;
}

function getTouchEventOffsetValues(e) {
  var el = e.target;
  var boundingRect = el.getBoundingClientRect();

  var offset = {
    offsetX: e.clientX - boundingRect.left,
    offsetY: e.clientY - boundingRect.top
  };

  return offset;
}

var ClockHours = _react2.default.createClass({
  displayName: 'ClockHours',

  propTypes: {
    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
    initialHours: _react2.default.PropTypes.number,
    onChange: _react2.default.PropTypes.func
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
      initialHours: new Date().getHours(),
      onChange: function onChange() {},
      format: 'ampm'
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
    var clockElement = _reactDom2.default.findDOMNode(this.refs.mask);

    this.center = {
      x: clockElement.offsetWidth / 2,
      y: clockElement.offsetHeight / 2
    };

    this.basePoint = {
      x: this.center.x,
      y: 0
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },

  center: { x: 0, y: 0 },
  basePoint: { x: 0, y: 0 },

  isMousePressed: function isMousePressed(e) {
    if (typeof e.buttons === 'undefined') {
      return e.nativeEvent.which;
    }

    return e.buttons;
  },
  handleUp: function handleUp(e) {
    e.preventDefault();
    this.setClock(e.nativeEvent, true);
  },
  handleMove: function handleMove(e) {
    e.preventDefault();
    if (this.isMousePressed(e) !== 1) return;
    this.setClock(e.nativeEvent, false);
  },
  handleTouchMove: function handleTouchMove(e) {
    e.preventDefault();
    this.setClock(e.changedTouches[0], false);
  },
  handleTouchEnd: function handleTouchEnd(e) {
    e.preventDefault();
    this.setClock(e.changedTouches[0], true);
  },
  setClock: function setClock(e, finish) {
    if (typeof e.offsetX === 'undefined') {
      var offset = getTouchEventOffsetValues(e);

      e.offsetX = offset.offsetX;
      e.offsetY = offset.offsetY;
    }

    var hours = this.getHours(e.offsetX, e.offsetY);

    this.props.onChange(hours, finish);
  },
  getHours: function getHours(offsetX, offsetY) {
    var step = 30;
    var x = offsetX - this.center.x;
    var y = offsetY - this.center.y;
    var cx = this.basePoint.x - this.center.x;
    var cy = this.basePoint.y - this.center.y;

    var atan = Math.atan2(cx, cy) - Math.atan2(x, y);

    var deg = rad2deg(atan);
    deg = Math.round(deg / step) * step;
    deg %= 360;

    var value = Math.floor(deg / step) || 0;

    var delta = Math.pow(x, 2) + Math.pow(y, 2);
    var distance = Math.sqrt(delta);

    value = value || 12;
    if (this.props.format === '24hr') {
      if (distance < 90) {
        value += 12;
        value %= 24;
      }
    } else {
      value %= 12;
    }

    return value;
  },
  _getSelected: function _getSelected() {
    var hour = this.props.initialHours;

    if (this.props.format === 'ampm') {
      hour %= 12;
      hour = hour || 12;
    }

    return hour;
  },
  _getHourNumbers: function _getHourNumbers() {
    var _this = this;

    var style = {
      pointerEvents: 'none'
    };
    var hourSize = this.props.format === 'ampm' ? 12 : 24;

    var hours = [];
    for (var i = 1; i <= hourSize; i++) {
      hours.push(i % 24);
    }

    return hours.map(function (hour) {
      var isSelected = _this._getSelected() === hour;
      return _react2.default.createElement(_clockNumber2.default, {
        key: hour,
        style: style,
        isSelected: isSelected,
        type: 'hour',
        value: hour
      });
    });
  },
  render: function render() {
    var styles = {
      root: {
        height: '100%',
        width: '100%',
        borderRadius: '100%',
        position: 'relative',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      },

      hitMask: {
        height: '100%',
        width: '100%',
        pointerEvents: 'auto'
      }
    };

    var hours = this._getSelected();
    var numbers = this._getHourNumbers();

    return _react2.default.createElement(
      'div',
      { ref: 'clock', style: this.prepareStyles(styles.root) },
      _react2.default.createElement(_clockPointer2.default, { hasSelected: true, value: hours, type: 'hour' }),
      numbers,
      _react2.default.createElement('div', {
        ref: 'mask', style: this.prepareStyles(styles.hitMask), onTouchMove: this.handleTouchMove,
        onTouchEnd: this.handleTouchEnd, onMouseUp: this.handleUp, onMouseMove: this.handleMove
      })
    );
  }
});

exports.default = ClockHours;
module.exports = exports['default'];