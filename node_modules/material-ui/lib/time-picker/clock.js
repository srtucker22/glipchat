'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _timeDisplay = require('./time-display');

var _timeDisplay2 = _interopRequireDefault(_timeDisplay);

var _clockHours = require('./clock-hours');

var _clockHours2 = _interopRequireDefault(_clockHours);

var _clockMinutes = require('./clock-minutes');

var _clockMinutes2 = _interopRequireDefault(_clockMinutes);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Clock = _react2.default.createClass({
  displayName: 'Clock',

  propTypes: {
    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
    initialTime: _react2.default.PropTypes.object,
    isActive: _react2.default.PropTypes.bool,
    mode: _react2.default.PropTypes.oneOf(['hour', 'minute']),
    onChangeHours: _react2.default.PropTypes.func,
    onChangeMinutes: _react2.default.PropTypes.func
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      initialTime: new Date()
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      selectedTime: this.props.initialTime,
      mode: 'hour'
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme,
      selectedTime: nextProps.initialTime
    });
  },
  _setMode: function _setMode(mode) {
    var _this = this;

    setTimeout(function () {
      _this.setState({
        mode: mode
      });
    }, 100);
  },
  _setAffix: function _setAffix(affix) {
    if (affix === this._getAffix()) return;

    var hours = this.state.selectedTime.getHours();

    if (affix === 'am') {
      this.handleChangeHours(hours - 12, affix);
      return;
    }

    this.handleChangeHours(hours + 12, affix);
  },
  _getAffix: function _getAffix() {
    if (this.props.format !== 'ampm') return '';

    var hours = this.state.selectedTime.getHours();
    if (hours < 12) {
      return 'am';
    }

    return 'pm';
  },
  handleChangeHours: function handleChangeHours(hours, finished) {
    var _this2 = this;

    var time = new Date(this.state.selectedTime);
    var affix = undefined;

    if (typeof finished === 'string') {
      affix = finished;
      finished = undefined;
    }
    if (!affix) {
      affix = this._getAffix();
    }
    if (affix === 'pm' && hours < 12) {
      hours += 12;
    }

    time.setHours(hours);
    this.setState({
      selectedTime: time
    });

    var onChangeHours = this.props.onChangeHours;

    if (finished) {
      setTimeout(function () {
        _this2.setState({
          mode: 'minute'
        });
        if (typeof onChangeHours === 'function') {
          onChangeHours(time);
        }
      }, 100);
    }
  },
  handleChangeMinutes: function handleChangeMinutes(minutes) {
    var time = new Date(this.state.selectedTime);
    time.setMinutes(minutes);
    this.setState({
      selectedTime: time
    });

    var onChangeMinutes = this.props.onChangeMinutes;

    if (typeof onChangeMinutes === 'function') {
      setTimeout(function () {
        onChangeMinutes(time);
      }, 0);
    }
  },
  getSelectedTime: function getSelectedTime() {
    return this.state.selectedTime;
  },
  render: function render() {
    var clock = null;

    var styles = {
      root: {},

      container: {
        height: 280,
        padding: 10,
        position: 'relative'
      },

      circle: {
        position: 'absolute',
        top: 20,
        width: 260,
        height: 260,
        borderRadius: '100%',
        backgroundColor: this.state.muiTheme.timePicker.clockCircleColor
      }
    };

    if (this.state.mode === 'hour') {
      clock = _react2.default.createElement(_clockHours2.default, { key: 'hours',
        format: this.props.format,
        onChange: this.handleChangeHours,
        initialHours: this.state.selectedTime.getHours()
      });
    } else {
      clock = _react2.default.createElement(_clockMinutes2.default, { key: 'minutes',
        onChange: this.handleChangeMinutes,
        initialMinutes: this.state.selectedTime.getMinutes()
      });
    }

    return _react2.default.createElement(
      'div',
      { style: this.prepareStyles(styles.root) },
      _react2.default.createElement(_timeDisplay2.default, {
        selectedTime: this.state.selectedTime,
        mode: this.state.mode,
        format: this.props.format,
        affix: this._getAffix(),
        onSelectAffix: this._setAffix,
        onSelectHour: this._setMode.bind(this, 'hour'),
        onSelectMin: this._setMode.bind(this, 'minute')
      }),
      _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.container) },
        _react2.default.createElement('div', { style: this.prepareStyles(styles.circle) }),
        clock
      )
    );
  }
});

exports.default = Clock;
module.exports = exports['default'];