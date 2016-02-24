'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _paper = require('../paper');

var _paper2 = _interopRequireDefault(_paper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
  actions: {
    marginRight: 8,
    paddingBottom: 12,
    textAlign: 'right'
  },
  container: {
    zIndex: 3,
    width: '100%',
    position: 'relative',
    display: 'block'
  },
  subContainer: {
    position: 'absolute',
    height: 'auto'
  }
};

var DatePickerInline = function (_React$Component) {
  _inherits(DatePickerInline, _React$Component);

  function DatePickerInline() {
    _classCallCheck(this, DatePickerInline);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(DatePickerInline).apply(this, arguments));
  }

  _createClass(DatePickerInline, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var actions = _props.actions;
      var children = _props.children;
      var open = _props.open;
      var style = _props.style;

      var other = _objectWithoutProperties(_props, ['actions', 'children', 'open', 'style']);

      if (!open) {
        return _react2.default.createElement('span', null);
      }

      return _react2.default.createElement(
        'div',
        { style: styles.container },
        _react2.default.createElement(
          'div',
          { style: styles.subContainer },
          _react2.default.createElement(
            _paper2.default,
            other,
            children,
            _react2.default.createElement(
              'div',
              { style: styles.actions },
              actions
            )
          )
        )
      );
    }
  }]);

  return DatePickerInline;
}(_react2.default.Component);

DatePickerInline.propTypes = {
  actions: _react2.default.PropTypes.node,
  children: _react2.default.PropTypes.node,
  open: _react2.default.PropTypes.bool,

  /**
   * Override the inline-styles of the root element.
   */
  style: _react2.default.PropTypes.object
};
DatePickerInline.defaultProps = {
  open: false
};
exports.default = DatePickerInline;
module.exports = exports['default'];