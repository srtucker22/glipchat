'use strict';

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

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var LinearProgress = _react2.default.createClass({
  displayName: 'LinearProgress',

  propTypes: {
    /**
     * The mode of show your progress, indeterminate for
     * when there is no value for progress.
     */
    color: _react2.default.PropTypes.string,

    /**
     * The max value of progress, only works in determinate mode.
     */
    max: _react2.default.PropTypes.number,

    /**
     * The min value of progress, only works in determinate mode.
     */
    min: _react2.default.PropTypes.number,

    /**
     * The mode of show your progress, indeterminate for when
     * there is no value for progress.
     */
    mode: _react2.default.PropTypes.oneOf(['determinate', 'indeterminate']),

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The value of progress, only works in determinate mode.
     */
    value: _react2.default.PropTypes.number
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
      mode: 'indeterminate',
      value: 0,
      min: 0,
      max: 100
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
    var _this = this;

    var bar1 = _reactDom2.default.findDOMNode(this.refs.bar1);
    var bar2 = _reactDom2.default.findDOMNode(this.refs.bar2);

    this.timers.bar1 = this._barUpdate('bar1', 0, bar1, [[-35, 100], [100, -90]]);

    this.timers.bar2 = setTimeout(function () {
      _this._barUpdate('bar2', 0, bar2, [[-200, 100], [107, -8]]);
    }, 850);
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },
  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.timers.bar1);
    clearTimeout(this.timers.bar2);
  },

  timers: {
    bar1: undefined,
    bar2: undefined
  },

  _barUpdate: function _barUpdate(id, step, barElement, stepValues) {
    var _this2 = this;

    if (this.props.mode !== 'indeterminate') return;

    step = step || 0;
    step %= 4;

    var right = this.state.muiTheme.isRtl ? 'left' : 'right';
    var left = this.state.muiTheme.isRtl ? 'right' : 'left';

    if (step === 0) {
      barElement.style[left] = stepValues[0][0] + '%';
      barElement.style[right] = stepValues[0][1] + '%';
    } else if (step === 1) {
      barElement.style.transitionDuration = '840ms';
    } else if (step === 2) {
      barElement.style[left] = stepValues[1][0] + '%';
      barElement.style[right] = stepValues[1][1] + '%';
    } else if (step === 3) {
      barElement.style.transitionDuration = '0ms';
    }
    this.timers[id] = setTimeout(function () {
      return _this2._barUpdate(id, step + 1, barElement, stepValues);
    }, 420);
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.rawTheme.palette;
  },
  getStyles: function getStyles() {
    var styles = {
      root: {
        position: 'relative',
        height: 4,
        display: 'block',
        width: '100%',
        backgroundColor: this.getTheme().primary3Color,
        borderRadius: 2,
        margin: 0,
        overflow: 'hidden'
      },
      bar: {
        height: '100%'
      },
      barFragment1: {},
      barFragment2: {}
    };

    if (this.props.mode === 'indeterminate') {
      styles.barFragment1 = {
        position: 'absolute',
        backgroundColor: this.props.color || this.getTheme().primary1Color,
        top: 0,
        left: 0,
        bottom: 0,
        transition: _transitions2.default.create('all', '840ms', null, 'cubic-bezier(0.650, 0.815, 0.735, 0.395)')
      };

      styles.barFragment2 = {
        position: 'absolute',
        backgroundColor: this.props.color || this.getTheme().primary1Color,
        top: 0,
        left: 0,
        bottom: 0,
        transition: _transitions2.default.create('all', '840ms', null, 'cubic-bezier(0.165, 0.840, 0.440, 1.000)')
      };
    } else {
      styles.bar.backgroundColor = this.props.color || this.getTheme().primary1Color;
      styles.bar.transition = _transitions2.default.create('width', '.3s', null, 'linear');
      styles.bar.width = this._getRelativeValue() + '%';
    }

    return styles;
  },
  _getRelativeValue: function _getRelativeValue() {
    var value = this.props.value;
    var min = this.props.min;
    var max = this.props.max;

    var clampedValue = Math.min(Math.max(min, value), max);
    var rangeValue = max - min;
    var relValue = Math.round(clampedValue / rangeValue * 10000) / 10000;
    return relValue * 100;
  },
  render: function render() {
    var _props = this.props;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['style']);

    var styles = this.getStyles();

    return _react2.default.createElement(
      'div',
      _extends({}, other, { style: this.prepareStyles(styles.root, style) }),
      _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.bar) },
        _react2.default.createElement('div', { ref: 'bar1', style: this.prepareStyles(styles.barFragment1) }),
        _react2.default.createElement('div', { ref: 'bar2', style: this.prepareStyles(styles.barFragment2) })
      )
    );
  }
});

exports.default = LinearProgress;
module.exports = exports['default'];