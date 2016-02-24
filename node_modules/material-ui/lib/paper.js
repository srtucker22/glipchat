'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _propTypes = require('./utils/prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Paper = _react2.default.createClass({
  displayName: 'Paper',

  propTypes: {
    /**
     * Children passed into the paper element.
     */
    children: _react2.default.PropTypes.node,

    /**
     * Set to true to generate a circlular paper container.
     */
    circle: _react2.default.PropTypes.bool,

    /**
     * By default, the paper container will have a border radius.
     * Set this to false to generate a container with sharp corners.
     */
    rounded: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Set to false to disable CSS transitions for the paper element.
     */
    transitionEnabled: _react2.default.PropTypes.bool,

    /**
     * This number represents the zDepth of the paper shadow.
     */
    zDepth: _propTypes2.default.zDepth
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_reactAddonsPureRenderMixin2.default, _stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      circle: false,
      rounded: true,
      transitionEnabled: true,
      zDepth: 1
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },
  render: function render() {
    var _props = this.props;
    var children = _props.children;
    var circle = _props.circle;
    var rounded = _props.rounded;
    var style = _props.style;
    var transitionEnabled = _props.transitionEnabled;
    var zDepth = _props.zDepth;

    var other = _objectWithoutProperties(_props, ['children', 'circle', 'rounded', 'style', 'transitionEnabled', 'zDepth']);

    var styles = {
      backgroundColor: this.state.muiTheme.paper.backgroundColor,
      transition: transitionEnabled && _transitions2.default.easeOut(),
      boxSizing: 'border-box',
      fontFamily: this.state.muiTheme.rawTheme.fontFamily,
      WebkitTapHighlightColor: 'rgba(0,0,0,0)',
      boxShadow: this.state.muiTheme.paper.zDepthShadows[zDepth - 1], // No shadow for 0 depth papers
      borderRadius: circle ? '50%' : rounded ? '2px' : '0px'
    };

    return _react2.default.createElement(
      'div',
      _extends({}, other, { style: this.prepareStyles(styles, style) }),
      children
    );
  }
});

exports.default = Paper;
module.exports = exports['default'];