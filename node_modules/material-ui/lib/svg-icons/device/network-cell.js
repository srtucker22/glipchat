'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _svgIcon = require('../../svg-icon');

var _svgIcon2 = _interopRequireDefault(_svgIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DeviceNetworkCell = _react2.default.createClass({
  displayName: 'DeviceNetworkCell',

  mixins: [_reactAddonsPureRenderMixin2.default],

  render: function render() {
    return _react2.default.createElement(
      _svgIcon2.default,
      this.props,
      _react2.default.createElement('path', { fillOpacity: '.3', d: 'M2 22h20V2z' }),
      _react2.default.createElement('path', { d: 'M17 7L2 22h15z' })
    );
  }
});

exports.default = DeviceNetworkCell;
module.exports = exports['default'];