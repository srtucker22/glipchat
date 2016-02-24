'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _colors = require('./styles/colors');

var _colors2 = _interopRequireDefault(_colors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Overlay = _react2.default.createClass({
  displayName: 'Overlay',

  propTypes: {
    autoLockScrolling: _react2.default.PropTypes.bool,
    show: _react2.default.PropTypes.bool.isRequired,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,
    transitionEnabled: _react2.default.PropTypes.bool
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      autoLockScrolling: true,
      transitionEnabled: true,
      style: {}
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this._applyAutoLockScrolling(this.props);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (this.props.show !== nextProps.show) {
      this._applyAutoLockScrolling(nextProps);
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    if (this.props.show === true) {
      this._allowScrolling();
    }
  },

  _originalBodyOverflow: '',

  setOpacity: function setOpacity(opacity) {
    var overlay = _reactDom2.default.findDOMNode(this);
    overlay.style.opacity = opacity;
  },
  getStyles: function getStyles() {
    return {
      root: {
        position: 'fixed',
        height: '100%',
        width: '100%',
        top: 0,
        left: '-100%',
        opacity: 0,
        backgroundColor: _colors2.default.lightBlack,
        WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',

        // Two ways to promote overlay to its own render layer
        willChange: 'opacity',
        transform: 'translateZ(0)',

        transition: this.props.transitionEnabled && _transitions2.default.easeOut('0ms', 'left', '400ms') + ',' + _transitions2.default.easeOut('400ms', 'opacity')
      },
      rootWhenShown: {
        left: '0',
        opacity: 1,
        transition: this.props.transitionEnabled && _transitions2.default.easeOut('0ms', 'left') + ',' + _transitions2.default.easeOut('400ms', 'opacity')
      }
    };
  },
  _applyAutoLockScrolling: function _applyAutoLockScrolling(props) {
    if (props.autoLockScrolling) {
      if (props.show) {
        this._preventScrolling();
      } else {
        this._allowScrolling();
      }
    }
  },
  _preventScrolling: function _preventScrolling() {
    var body = document.getElementsByTagName('body')[0];
    this._originalBodyOverflow = body.style.overflow;

    body.style.overflow = 'hidden';
  },
  _allowScrolling: function _allowScrolling() {
    var body = document.getElementsByTagName('body')[0];
    body.style.overflow = this._originalBodyOverflow || '';
  },
  render: function render() {
    var _props = this.props;
    var show = _props.show;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['show', 'style']);

    var styles = this.mergeStyles(this.getStyles().root, style, show && this.getStyles().rootWhenShown);

    return _react2.default.createElement('div', _extends({}, other, { style: this.prepareStyles(styles) }));
  }
});

exports.default = Overlay;
module.exports = exports['default'];