"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {

  Desktop: {
    GUTTER: 24,
    GUTTER_LESS: 16,
    INCREMENT: 64,
    MENU_ITEM_HEIGHT: 32
  },

  getIncrementalDim: function getIncrementalDim(dim) {
    return Math.ceil(dim / this.Desktop.INCREMENT) * this.Desktop.INCREMENT;
  }
};
module.exports = exports['default'];