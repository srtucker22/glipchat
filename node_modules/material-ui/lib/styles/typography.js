'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Typography = function Typography() {
  _classCallCheck(this, Typography);

  // text colors
  this.textFullBlack = _colors2.default.fullBlack;
  this.textDarkBlack = _colors2.default.darkBlack;
  this.textLightBlack = _colors2.default.lightBlack;
  this.textMinBlack = _colors2.default.minBlack;
  this.textFullWhite = _colors2.default.fullWhite;
  this.textDarkWhite = _colors2.default.darkWhite;
  this.textLightWhite = _colors2.default.lightWhite;

  // font weight
  this.fontWeightLight = 300;
  this.fontWeightNormal = 400;
  this.fontWeightMedium = 500;

  this.fontStyleButtonFontSize = 14;
};

exports.default = new Typography();
module.exports = exports['default'];