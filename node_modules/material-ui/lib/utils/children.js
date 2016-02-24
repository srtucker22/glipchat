'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsCreateFragment = require('react-addons-create-fragment');

var _reactAddonsCreateFragment2 = _interopRequireDefault(_reactAddonsCreateFragment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  create: function create(fragments) {
    var newFragments = {};
    var validChildrenCount = 0;
    var firstKey = undefined;

    //Only create non-empty key fragments
    for (var key in fragments) {
      var currentChild = fragments[key];

      if (currentChild) {
        if (validChildrenCount === 0) firstKey = key;
        newFragments[key] = currentChild;
        validChildrenCount++;
      }
    }

    if (validChildrenCount === 0) return undefined;
    if (validChildrenCount === 1) return newFragments[firstKey];
    return (0, _reactAddonsCreateFragment2.default)(newFragments);
  },
  extend: function extend(children, extendedProps, extendedChildren) {

    return _react2.default.isValidElement(children) ? _react2.default.Children.map(children, function (child) {

      var newProps = typeof extendedProps === 'function' ? extendedProps(child) : extendedProps;

      var newChildren = typeof extendedChildren === 'function' ? extendedChildren(child) : extendedChildren ? extendedChildren : child.props.children;

      return _react2.default.cloneElement(child, newProps, newChildren);
    }) : children;
  }
};
module.exports = exports['default'];