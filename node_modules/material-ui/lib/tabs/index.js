'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tabs = exports.Tab = undefined;

var _tab = require('./tab');

var _tab2 = _interopRequireDefault(_tab);

var _tabs = require('./tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Tab = _tab2.default;
exports.Tabs = _tabs2.default;
exports.default = {
  Tab: _tab2.default,
  Tabs: _tabs2.default
};