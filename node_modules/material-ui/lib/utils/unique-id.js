'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var index = 0;

exports.default = {
  generate: function generate() {
    return 'mui-id-' + index++;
  }
};
module.exports = exports['default'];