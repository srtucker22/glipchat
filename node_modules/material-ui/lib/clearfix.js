'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _beforeAfterWrapper = require('./before-after-wrapper');

var _beforeAfterWrapper2 = _interopRequireDefault(_beforeAfterWrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var styles = {
  before: {
    content: "' '",
    display: 'table'
  },
  after: {
    content: "' '",
    clear: 'both',
    display: 'table'
  }
};

var ClearFix = function ClearFix(_ref) {
  var style = _ref.style;
  var children = _ref.children;

  var other = _objectWithoutProperties(_ref, ['style', 'children']);

  return _react2.default.createElement(
    _beforeAfterWrapper2.default,
    _extends({}, other, {
      beforeStyle: styles.before,
      afterStyle: styles.after,
      style: style
    }),
    children
  );
};

ClearFix.displayName = 'ClearFix';

ClearFix.propTypes = {
  children: _react2.default.PropTypes.node,

  /**
   * Override the inline-styles of the root element.
   */
  style: _react2.default.PropTypes.object
};

exports.default = ClearFix;
module.exports = exports['default'];