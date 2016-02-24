'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _dateTime = require('../utils/date-time');

var _dateTime2 = _interopRequireDefault(_dateTime);

var _dayButton = require('./day-button');

var _dayButton2 = _interopRequireDefault(_dayButton);

var _clearfix = require('../clearfix');

var _clearfix2 = _interopRequireDefault(_clearfix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CalendarMonth = _react2.default.createClass({
  displayName: 'CalendarMonth',

  propTypes: {
    autoOk: _react2.default.PropTypes.bool,
    displayDate: _react2.default.PropTypes.object.isRequired,
    firstDayOfWeek: _react2.default.PropTypes.number,
    maxDate: _react2.default.PropTypes.object,
    minDate: _react2.default.PropTypes.object,
    onDayTouchTap: _react2.default.PropTypes.func,
    selectedDate: _react2.default.PropTypes.object.isRequired,
    shouldDisableDate: _react2.default.PropTypes.func
  },

  isSelectedDateDisabled: function isSelectedDateDisabled() {
    return this._selectedDateDisabled;
  },
  _getWeekElements: function _getWeekElements() {
    var _this = this;

    var weekArray = _dateTime2.default.getWeekArray(this.props.displayDate, this.props.firstDayOfWeek);

    return weekArray.map(function (week, i) {
      return _react2.default.createElement(
        _clearfix2.default,
        { key: i },
        _this._getDayElements(week, i)
      );
    }, this);
  },
  _getDayElements: function _getDayElements(week, i) {
    var _this2 = this;

    return week.map(function (day, j) {
      var isSameDate = _dateTime2.default.isEqualDate(_this2.props.selectedDate, day);
      var disabled = _this2._shouldDisableDate(day);
      var selected = !disabled && isSameDate;

      if (isSameDate) {
        if (disabled) {
          _this2._selectedDateDisabled = true;
        } else {
          _this2._selectedDateDisabled = false;
        }
      }

      return _react2.default.createElement(_dayButton2.default, {
        key: 'db' + i + j,
        date: day,
        onTouchTap: _this2._handleDayTouchTap,
        selected: selected,
        disabled: disabled
      });
    }, this);
  },
  _handleDayTouchTap: function _handleDayTouchTap(e, date) {
    if (this.props.onDayTouchTap) this.props.onDayTouchTap(e, date);
  },
  _shouldDisableDate: function _shouldDisableDate(day) {
    if (day === null) return false;
    var disabled = !_dateTime2.default.isBetweenDates(day, this.props.minDate, this.props.maxDate);
    if (!disabled && this.props.shouldDisableDate) disabled = this.props.shouldDisableDate(day);

    return disabled;
  },
  render: function render() {
    var styles = {
      lineHeight: '32px',
      textAlign: 'center',
      padding: '16px 14px 0 14px'
    };

    return _react2.default.createElement(
      'div',
      { style: styles },
      this._getWeekElements()
    );
  }
});

exports.default = CalendarMonth;
module.exports = exports['default'];