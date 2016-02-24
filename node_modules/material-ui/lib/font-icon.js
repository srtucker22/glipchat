'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _transitions = require('./styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FontIcon = _react2.default.createClass({
  displayName: 'FontIcon',

  propTypes: {
    /**
     * This is the font color of the font icon. If not specified,
     * this component will default to muiTheme.palette.textColor.
     */
    color: _react2.default.PropTypes.string,

    /**
     * This is the icon color when the mouse hovers over the icon.
     */
    hoverColor: _react2.default.PropTypes.string,

    /**
     * Function called when mouse enters this element.
     */
    onMouseEnter: _react2.default.PropTypes.func,

    /**
     * Function called when mouse leaves this element.
     */
    onMouseLeave: _react2.default.PropTypes.func,

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

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      onMouseEnter: function onMouseEnter() {},
      onMouseLeave: function onMouseLeave() {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      hovered: false,
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
  _handleMouseLeave: function _handleMouseLeave(e) {
    // hover is needed only when a hoverColor is defined
    if (this.props.hoverColor !== undefined) this.setState({ hovered: false });
    if (this.props.onMouseLeave) {
      this.props.onMouseLeave(e);
    }
  },
  _handleMouseEnter: function _handleMouseEnter(e) {
    // hover is needed only when a hoverColor is defined
    if (this.props.hoverColor !== undefined) this.setState({ hovered: true });
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(e);
    }
  },
  render: function render() {
    var _props = this.props;
    var color = _props.color;
    var hoverColor = _props.hoverColor;
    var onMouseLeave = _props.onMouseLeave;
    var onMouseEnter = _props.onMouseEnter;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['color', 'hoverColor', 'onMouseLeave', 'onMouseEnter', 'style']);

    var spacing = this.state.muiTheme.rawTheme.spacing;
    var offColor = color ? color : style && style.color ? style.color : this.state.muiTheme.rawTheme.palette.textColor;
    var onColor = hoverColor ? hoverColor : offColor;

    var mergedStyles = this.mergeStyles({
      position: 'relative',
      fontSize: spacing.iconSize,
      display: 'inline-block',
      userSelect: 'none',
      transition: _transitions2.default.easeOut()
    }, style, {
      color: this.state.hovered ? onColor : offColor
    });

    return _react2.default.createElement('span', _extends({}, other, {
      onMouseLeave: this._handleMouseLeave,
      onMouseEnter: this._handleMouseEnter,
      style: this.prepareStyles(mergedStyles)
    }));
  }
});

exports.default = FontIcon;
module.exports = exports['default'];