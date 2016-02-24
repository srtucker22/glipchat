"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (muiTheme) {
  if (muiTheme.userAgent !== false) {
    return function (style) {
      return muiTheme.prefix(style);
    };
  }
};

module.exports = exports['default'];