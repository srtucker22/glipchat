'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DatePickerDialog = exports.DatePicker = undefined;

var _datePicker = require('./date-picker');

var _datePicker2 = _interopRequireDefault(_datePicker);

var _datePickerDialog = require('./date-picker-dialog');

var _datePickerDialog2 = _interopRequireDefault(_datePickerDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.DatePicker = _datePicker2.default;
exports.DatePickerDialog = _datePickerDialog2.default;
exports.default = {
  DatePicker: _datePicker2.default,
  DatePickerDialog: _datePickerDialog2.default
};