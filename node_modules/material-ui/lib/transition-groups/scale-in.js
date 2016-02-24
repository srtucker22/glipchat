'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _reactAddonsTransitionGroup = require('react-addons-transition-group');

var _reactAddonsTransitionGroup2 = _interopRequireDefault(_reactAddonsTransitionGroup);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _scaleInChild = require('./scale-in-child');

var _scaleInChild2 = _interopRequireDefault(_scaleInChild);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var ScaleIn = _react2.default.createClass({
  displayName: 'ScaleIn',

  propTypes: {
    childStyle: _react2.default.PropTypes.object,
    children: _react2.default.PropTypes.node,
    enterDelay: _react2.default.PropTypes.number,
    maxScale: _react2.default.PropTypes.number,
    minScale: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
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
      enterDelay: 0
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
    var childStyle = _props.childStyle;
    var enterDelay = _props.enterDelay;
    var maxScale = _props.maxScale;
    var minScale = _props.minScale;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['children', 'childStyle', 'enterDelay', 'maxScale', 'minScale', 'style']);

    var mergedRootStyles = this.mergeStyles({
      position: 'relative',
      overflow: 'hidden',
      height: '100%'
    }, style);

    var newChildren = _react2.default.Children.map(children, function (child) {
      return _react2.default.createElement(
        _scaleInChild2.default,
        {
          key: child.key,
          enterDelay: enterDelay,
          maxScale: maxScale,
          minScale: minScale,
          style: childStyle
        },
        child
      );
    });

    return _react2.default.createElement(
      _reactAddonsTransitionGroup2.default,
      _extends({}, other, {
        style: this.prepareStyles(mergedRootStyles),
        component: 'div'
      }),
      newChildren
    );
  }
});

exports.default = ScaleIn;
module.exports = exports['default'];