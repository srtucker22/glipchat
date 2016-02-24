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

var ClockMinutes = _react2.default.createClass({
  displayName: 'ClockMinutes',

  propTypes: {
    initialMinutes: _react2.default.PropTypes.number,
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
      initialMinutes: new Date().getMinutes(),
      onChange: function onChange() {}
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
  handleTouch: function handleTouch(e) {
    e.preventDefault();
    this.setClock(e.changedTouches[0], false);
  },
  setClock: function setClock(e, finish) {
    if (typeof e.offsetX === 'undefined') {
      var offset = getTouchEventOffsetValues(e);

      e.offsetX = offset.offsetX;
      e.offsetY = offset.offsetY;
    }

    var minutes = this.getMinutes(e.offsetX, e.offsetY);

    this.props.onChange(minutes, finish);
  },
  getMinutes: function getMinutes(offsetX, offsetY) {
    var step = 6;
    var x = offsetX - this.center.x;
    var y = offsetY - this.center.y;
    var cx = this.basePoint.x - this.center.x;
    var cy = this.basePoint.y - this.center.y;

    var atan = Math.atan2(cx, cy) - Math.atan2(x, y);

    var deg = rad2deg(atan);
    deg = Math.round(deg / step) * step;
    deg %= 360;

    var value = Math.floor(deg / step) || 0;

    return value;
  },
  _getMinuteNumbers: function _getMinuteNumbers() {
    var minutes = [];
    for (var i = 0; i < 12; i++) {
      minutes.push(i * 5);
    }
    var selectedMinutes = this.props.initialMinutes;
    var hasSelected = false;

    var numbers = minutes.map(function (minute) {
      var isSelected = selectedMinutes === minute;
      if (isSelected) hasSelected = true;
      return _react2.default.createElement(_clockNumber2.default, {
        key: minute, isSelected: isSelected, type: 'minute',
        value: minute
      });
    });

    return {
      numbers: numbers,
      hasSelected: hasSelected,
      selected: selectedMinutes
    };
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

    var minutes = this._getMinuteNumbers();

    return _react2.default.createElement(
      'div',
      { ref: 'clock', style: this.prepareStyles(styles.root) },
      _react2.default.createElement(_clockPointer2.default, { value: minutes.selected, type: 'minute' }),
      minutes.numbers,
      _react2.default.createElement('div', { ref: 'mask', style: this.prepareStyles(styles.hitMask), hasSelected: minutes.hasSelected,
        onTouchMove: this.handleTouch, onTouchEnd: this.handleTouch,
        onMouseUp: this.handleUp, onMouseMove: this.handleMove
      })
    );
  }
});

exports.default = ClockMinutes;
module.exports = exports['default'];