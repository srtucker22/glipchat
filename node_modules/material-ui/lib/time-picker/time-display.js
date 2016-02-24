'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TimeDisplay = _react2.default.createClass({
  displayName: 'TimeDisplay',

  propTypes: {
    affix: _react2.default.PropTypes.oneOf(['', 'pm', 'am']),
    format: _react2.default.PropTypes.oneOf(['ampm', '24hr']),
    mode: _react2.default.PropTypes.oneOf(['hour', 'minute']),
    onSelectAffix: _react2.default.PropTypes.func,
    onSelectHour: _react2.default.PropTypes.func,
    onSelectMin: _react2.default.PropTypes.func,
    selectedTime: _react2.default.PropTypes.object.isRequired
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
      mode: 'hour',
      affix: ''
    };
  },
  getInitialState: function getInitialState() {
    return {
      transitionDirection: 'up',
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var direction = undefined;
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });

    if (nextProps.selectedTime !== this.props.selectedTime) {
      direction = nextProps.selectedTime > this.props.selectedTime ? 'up' : 'down';

      this.setState({
        transitionDirection: direction
      });
    }
  },
  sanitizeTime: function sanitizeTime() {
    var hour = this.props.selectedTime.getHours();
    var min = this.props.selectedTime.getMinutes().toString();

    if (this.props.format === 'ampm') {
      hour %= 12;
      hour = hour || 12;
    }

    hour = hour.toString();
    if (hour.length < 2) hour = '0' + hour;
    if (min.length < 2) min = '0' + min;

    return [hour, min];
  },
  getTheme: function getTheme() {
    return this.state.muiTheme.timePicker;
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var selectedTime = _props.selectedTime;
    var mode = _props.mode;
    var affix = _props.affix;

    var other = _objectWithoutProperties(_props, ['selectedTime', 'mode', 'affix']);

    var styles = {
      root: {
        position: 'relative',
        width: 280,
        height: '100%'
      },

      box: {
        padding: '14px 0',
        borderTopLeftRadius: 2,
        borderTopRightRadius: 2,
        backgroundColor: this.getTheme().headerColor,
        color: 'white'
      },

      text: {
        margin: '6px 0',
        lineHeight: '58px',
        height: 58,
        fontSize: 58,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'baseline'
      },

      time: {
        margin: '0 10px'
      },

      affix: {
        flex: 1,
        position: 'relative',
        lineHeight: '17px',
        height: 17,
        fontSize: 17
      },

      affixTop: {
        position: 'absolute',
        top: -20,
        left: 0
      },

      clickable: {
        cursor: 'pointer'
      },

      inactive: {
        opacity: 0.7
      }
    };

    var _sanitizeTime = this.sanitizeTime();

    var _sanitizeTime2 = _slicedToArray(_sanitizeTime, 2);

    var hour = _sanitizeTime2[0];
    var min = _sanitizeTime2[1];

    var buttons = [];
    if (this.props.format === 'ampm') {
      buttons = [_react2.default.createElement(
        'div',
        {
          key: 'pm',
          style: this.prepareStyles(styles.clickable, affix === 'pm' ? {} : styles.inactive),
          onTouchTap: function onTouchTap() {
            return _this.props.onSelectAffix('pm');
          }
        },
        "PM"
      ), _react2.default.createElement(
        'div',
        {
          key: 'am',
          style: this.prepareStyles(styles.affixTop, styles.clickable, affix === 'am' ? {} : styles.inactive),
          onTouchTap: function onTouchTap() {
            return _this.props.onSelectAffix('am');
          }
        },
        "AM"
      )];
    }

    return _react2.default.createElement(
      'div',
      _extends({}, other, { style: this.prepareStyles(styles.root) }),
      _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.box) },
        _react2.default.createElement(
          'div',
          { style: this.prepareStyles(styles.text) },
          _react2.default.createElement('div', { style: this.prepareStyles(styles.affix) }),
          _react2.default.createElement(
            'div',
            { style: this.prepareStyles(styles.time) },
            _react2.default.createElement(
              'span',
              {
                style: this.prepareStyles(styles.clickable, mode === 'hour' ? {} : styles.inactive),
                onTouchTap: this.props.onSelectHour
              },
              hour
            ),
            _react2.default.createElement(
              'span',
              null,
              ':'
            ),
            _react2.default.createElement(
              'span',
              {
                style: this.prepareStyles(styles.clickable, mode === 'minute' ? {} : styles.inactive),
                onTouchTap: this.props.onSelectMin
              },
              min
            )
          ),
          _react2.default.createElement(
            'div',
            { style: this.prepareStyles(styles.affix) },
            buttons
          )
        )
      )
    );
  }
});

exports.default = TimeDisplay;
module.exports = exports['default'];