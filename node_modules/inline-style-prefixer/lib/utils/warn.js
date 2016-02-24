// only throw warnings if devmode is enabled
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function () {
  if (process.env.NODE_ENV !== 'production') {
    console.warn.apply(console, arguments);
  }
};

module.exports = exports['default'];