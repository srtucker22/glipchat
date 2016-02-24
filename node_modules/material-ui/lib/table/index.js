'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TableRowColumn = exports.TableRow = exports.TableHeaderColumn = exports.TableHeader = exports.TableFooter = exports.TableBody = exports.Table = undefined;

var _table = require('./table');

var _table2 = _interopRequireDefault(_table);

var _tableBody = require('./table-body');

var _tableBody2 = _interopRequireDefault(_tableBody);

var _tableFooter = require('./table-footer');

var _tableFooter2 = _interopRequireDefault(_tableFooter);

var _tableHeader = require('./table-header');

var _tableHeader2 = _interopRequireDefault(_tableHeader);

var _tableHeaderColumn = require('./table-header-column');

var _tableHeaderColumn2 = _interopRequireDefault(_tableHeaderColumn);

var _tableRow = require('./table-row');

var _tableRow2 = _interopRequireDefault(_tableRow);

var _tableRowColumn = require('./table-row-column');

var _tableRowColumn2 = _interopRequireDefault(_tableRowColumn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Table = _table2.default;
exports.TableBody = _tableBody2.default;
exports.TableFooter = _tableFooter2.default;
exports.TableHeader = _tableHeader2.default;
exports.TableHeaderColumn = _tableHeaderColumn2.default;
exports.TableRow = _tableRow2.default;
exports.TableRowColumn = _tableRowColumn2.default;
exports.default = {
  Table: _table2.default,
  TableBody: _tableBody2.default,
  TableFooter: _tableFooter2.default,
  TableHeader: _tableHeader2.default,
  TableHeaderColumn: _tableHeaderColumn2.default,
  TableRow: _tableRow2.default,
  TableRowColumn: _tableRowColumn2.default
};