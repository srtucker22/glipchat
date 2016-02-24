'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getName = function getName(object) {
  return object.displayName ? object.displayName + ' ' : '';
};

function deprecatedExport(object, deprecatedPath, supportedPath) {
  process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'Importing ' + getName(object) + 'from \'' + deprecatedPath + '\' has been deprecated, use \'' + supportedPath + '\' instead.') : undefined;
  return object;
}

exports.default = deprecatedExport;
module.exports = exports['default'];