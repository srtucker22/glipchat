'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = prefixPlugin;

var _prefixer = require('../prefixer');

function prefixPlugin(_ref // eslint-disable-line no-shadow
) {
  var config = _ref.config;
  var style = _ref.style;

  var newStyle = (0, _prefixer.getPrefixedStyle)(style, config.userAgent);
  return { style: newStyle };
}
module.exports = exports['default'];