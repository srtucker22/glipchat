'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ClockPointer = _react2.default.createClass({
  displayName: 'ClockPointer',

  propTypes: {
    hasSelected: _react2.default.PropTypes.bool,
    type: _react2.default.PropTypes.oneOf(['hour', 'minute']),
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
      value: null,
      type: 'minute',
      hasSelected: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      inner: this.isInner(this.props.value),
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      inner: this.isInner(nextProps.value),
      muiTheme: newMuiTheme
    });
  },
  isInner: function isInner(value) {
    if (this.props.type !== 'hour') {
      return false;
    }
    return value < 1 || value > 12;
  },
  getAngle: function getAngle() {
    if (this.props.type === 'hour') {
      return this.calcAngle(this.props.value, 12);
    }

    return this.calcAngle(this.props.value, 60);
  },
  calcAngle: function calcAngle(value, base) {
    value %= base;
    var angle = 360 / base * value;
    return angle;
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.timePicker;
  },
  render: function render() {
    if (this.props.value === null) {
      return _react2.default.createElement('span', null);
    }

    var angle = this.getAngle();

    var styles = {
      root: {
        height: '30%',
        background: this.getTheme().accentColor,
        width: 2,
        left: 'calc(50% - 1px)',
        position: 'absolute',
        bottom: '50%',
        transformOrigin: 'bottom',
        pointerEvents: 'none',
        transform: 'rotateZ(' + angle + 'deg)'
      },
      mark: {
        background: this.getTheme().selectTextColor,
        border: '4px solid ' + this.getTheme().accentColor,
        width: 7,
        height: 7,
        position: 'absolute',
        top: -5,
        left: -6,
        borderRadius: '100%'
      }
    };

    if (!this.state.inner) {
      styles.root.height = '40%';
    }

    if (this.props.hasSelected) {
      styles.mark.display = 'none';
    }

    return _react2.default.createElement(
      'div',
      { style: this.prepareStyles(styles.root) },
      _react2.default.createElement('div', { style: this.prepareStyles(styles.mark) })
    );
  }
});

exports.default = ClockPointer;
module.exports = exports['default'];