'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dayAbbreviation = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
var dayList = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var monthLongList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function DateTimeFormat(locale, options) {
  process.env.NODE_ENV !== "production" ? (0, _warning2.default)(locale === 'en-US', 'Wrong usage of DateTimeFormat. The ' + locale + ' locale is not supported.') : undefined;

  this.format = function (date) {
    var output = undefined;

    if (options.month === 'short' && options.weekday === 'short' && options.day === '2-digit') {

      output = dayList[date.getDay()] + ', ';
      output += monthList[date.getMonth()] + ' ';
      output += date.getDate();
    } else if (options.month === 'long' && options.year === 'numeric') {
      output = monthLongList[date.getMonth()];
      output += ' ' + date.getFullYear();
    } else if (options.weekday === 'narrow') {
      output = dayAbbreviation[date.getDay()];
    } else {
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'Wrong usage of DateTimeFormat') : undefined;
    }

    return output;
  };
}

exports.default = {
  DateTimeFormat: DateTimeFormat,

  addDays: function addDays(d, days) {
    var newDate = this.clone(d);
    newDate.setDate(d.getDate() + days);
    return newDate;
  },
  addMonths: function addMonths(d, months) {
    var newDate = this.clone(d);
    newDate.setMonth(d.getMonth() + months);
    return newDate;
  },
  addYears: function addYears(d, years) {
    var newDate = this.clone(d);
    newDate.setFullYear(d.getFullYear() + years);
    return newDate;
  },
  clone: function clone(d) {
    return new Date(d.getTime());
  },
  cloneAsDate: function cloneAsDate(d) {
    var clonedDate = this.clone(d);
    clonedDate.setHours(0, 0, 0, 0);
    return clonedDate;
  },
  getDaysInMonth: function getDaysInMonth(d) {
    var resultDate = this.getFirstDayOfMonth(d);

    resultDate.setMonth(resultDate.getMonth() + 1);
    resultDate.setDate(resultDate.getDate() - 1);

    return resultDate.getDate();
  },
  getFirstDayOfMonth: function getFirstDayOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  },
  getFirstDayOfWeek: function getFirstDayOfWeek() {
    var now = new Date();
    return new Date(now.setDate(now.getDate() - now.getDay()));
  },
  getWeekArray: function getWeekArray(d, firstDayOfWeek) {
    var dayArray = [];
    var daysInMonth = this.getDaysInMonth(d);
    var weekArray = [];
    var week = [];

    for (var i = 1; i <= daysInMonth; i++) {
      dayArray.push(new Date(d.getFullYear(), d.getMonth(), i));
    }

    var addWeek = function addWeek(week) {
      var emptyDays = 7 - week.length;
      for (var i = 0; i < emptyDays; ++i) {
        week[weekArray.length ? 'push' : 'unshift'](null);
      }
      weekArray.push(week);
    };

    dayArray.forEach(function (day) {
      if (week.length > 0 && day.getDay() === firstDayOfWeek) {
        addWeek(week);
        week = [];
      }
      week.push(day);
      if (dayArray.indexOf(day) === dayArray.length - 1) {
        addWeek(week);
      }
    });

    return weekArray;
  },
  localizedWeekday: function localizedWeekday(DateTimeFormat, locale, day, firstDayOfWeek) {
    var weekdayFormatter = new DateTimeFormat(locale, { weekday: 'narrow' });
    var firstDayDate = this.getFirstDayOfWeek();

    return weekdayFormatter.format(this.addDays(firstDayDate, day + firstDayOfWeek));
  },
  format: function format(date) {
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var y = date.getFullYear();
    return m + '/' + d + '/' + y;
  },
  isEqualDate: function isEqualDate(d1, d2) {
    return d1 && d2 && d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
  },
  isBeforeDate: function isBeforeDate(d1, d2) {
    var date1 = this.cloneAsDate(d1);
    var date2 = this.cloneAsDate(d2);

    return date1.getTime() < date2.getTime();
  },
  isAfterDate: function isAfterDate(d1, d2) {
    var date1 = this.cloneAsDate(d1);
    var date2 = this.cloneAsDate(d2);

    return date1.getTime() > date2.getTime();
  },
  isBetweenDates: function isBetweenDates(dateToCheck, startDate, endDate) {
    return !this.isBeforeDate(dateToCheck, startDate) && !this.isAfterDate(dateToCheck, endDate);
  },
  isDateObject: function isDateObject(d) {
    return d instanceof Date;
  },
  monthDiff: function monthDiff(d1, d2) {
    var m = undefined;
    m = (d1.getFullYear() - d2.getFullYear()) * 12;
    m += d1.getMonth();
    m -= d2.getMonth();
    return m;
  },
  yearDiff: function yearDiff(d1, d2) {
    return ~ ~(this.monthDiff(d1, d2) / 12);
  }
};
module.exports = exports['default'];