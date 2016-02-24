'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _autoPrefix = require('../styles/auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _colors = require('../styles/colors');

var _colors2 = _interopRequireDefault(_colors);

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _scaleIn = require('../transition-groups/scale-in');

var _scaleIn2 = _interopRequireDefault(_scaleIn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pulsateDuration = 750;

var FocusRipple = _react2.default.createClass({
  displayName: 'FocusRipple',

  propTypes: {
    color: _react2.default.PropTypes.string,
    innerStyle: _react2.default.PropTypes.object,

    /**
     * The material-ui theme applied to this component.
     */
    muiTheme: _react2.default.PropTypes.object.isRequired,

    opacity: _react2.default.PropTypes.number,
    show: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
  },

  mixins: [_reactAddonsPureRenderMixin2.default, _stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      color: _colors2.default.darkBlack
    };
  },
  componentDidMount: function componentDidMount() {
    if (this.props.show) {
      this._setRippleSize();
      this._pulsate();
    }
  },
  componentDidUpdate: function componentDidUpdate() {
    if (this.props.show) {
      this._setRippleSize();
      this._pulsate();
    } else {
      if (this._timeout) clearTimeout(this._timeout);
    }
  },
  _getRippleElement: function _getRippleElement(props) {
    var color = props.color;
    var innerStyle = props.innerStyle;
    var opacity = props.opacity;

    var innerStyles = this.mergeStyles({
      position: 'absolute',
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      opacity: opacity ? opacity : 0.16,
      backgroundColor: color,
      transition: _transitions2.default.easeOut(pulsateDuration + 'ms', 'transform', null, _transitions2.default.easeInOutFunction)
    }, innerStyle);

    return _react2.default.createElement('div', { ref: 'innerCircle', style: this.prepareStyles(innerStyles) });
  },
  _pulsate: function _pulsate() {
    if (!this.isMounted()) return;

    var innerCircle = _reactDom2.default.findDOMNode(this.refs.innerCircle);
    if (!innerCircle) return;

    var startScale = 'scale(1)';
    var endScale = 'scale(0.85)';
    var currentScale = innerCircle.style.transform;
    var nextScale = undefined;

    currentScale = currentScale || startScale;
    nextScale = currentScale === startScale ? endScale : startScale;

    _autoPrefix2.default.set(innerCircle.style, 'transform', nextScale, this.props.muiTheme);
    this._timeout = setTimeout(this._pulsate, pulsateDuration);
  },
  _setRippleSize: function _setRippleSize() {
    var el = _reactDom2.default.findDOMNode(this.refs.innerCircle);
    var height = el.offsetHeight;
    var width = el.offsetWidth;
    var size = Math.max(height, width);

    var oldTop = 0;
    // For browsers that don't support endsWith()
    if (el.style.top.indexOf('px', el.style.top.length - 2) !== -1) {
      oldTop = parseInt(el.style.top);
    }
    el.style.height = size + 'px';
    el.style.top = height / 2 - size / 2 + oldTop + 'px';
  },
  render: function render() {
    var _props = this.props;
    var show = _props.show;
    var style = _props.style;

    var mergedRootStyles = this.mergeStyles({
      height: '100%',
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0
    }, style);

    var ripple = show ? this._getRippleElement(this.props) : null;

    return _react2.default.createElement(
      _scaleIn2.default,
      {
        maxScale: 0.85,
        style: mergedRootStyles
      },
      ripple
    );
  }
});

exports.default = FocusRipple;
module.exports = exports['default'];