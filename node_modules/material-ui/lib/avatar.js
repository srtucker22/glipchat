'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _colors = require('./styles/colors');

var _colors2 = _interopRequireDefault(_colors);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Avatar = _react2.default.createClass({
  displayName: 'Avatar',

  propTypes: {
    /**
     * The backgroundColor of the avatar. Does not apply to image avatars.
     */
    backgroundColor: _react2.default.PropTypes.string,

    /**
     * Can be used, for instance, to render a letter inside the avatar.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root `div` or `img` element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * The icon or letter's color.
     */
    color: _react2.default.PropTypes.string,

    /**
     * This is the SvgIcon or FontIcon to be used inside the avatar.
     */
    icon: _react2.default.PropTypes.element,

    /**
     * This is the size of the avatar in pixels.
     */
    size: _react2.default.PropTypes.number,

    /**
     * If passed in, this component will render an img element. Otherwise, a div will be rendered.
     */
    src: _react2.default.PropTypes.string,

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
      backgroundColor: _colors2.default.grey400,
      color: _colors2.default.white,
      size: 40
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
    var backgroundColor = _props.backgroundColor;
    var color = _props.color;
    var icon = _props.icon;
    var size = _props.size;
    var src = _props.src;
    var style = _props.style;
    var className = _props.className;

    var other = _objectWithoutProperties(_props, ['backgroundColor', 'color', 'icon', 'size', 'src', 'style', 'className']);

    var styles = {
      root: {
        height: size,
        width: size,
        userSelect: 'none',
        borderRadius: '50%',
        display: 'inline-block'
      }
    };

    if (src) {
      var borderColor = this.state.muiTheme.avatar.borderColor;

      if (borderColor) {
        styles.root = this.mergeStyles(styles.root, {
          height: size - 2,
          width: size - 2,
          border: 'solid 1px ' + borderColor
        });
      }

      return _react2.default.createElement('img', _extends({}, other, {
        src: src,
        style: this.prepareStyles(styles.root, style),
        className: className
      }));
    } else {
      styles.root = this.mergeStyles(styles.root, {
        backgroundColor: backgroundColor,
        textAlign: 'center',
        lineHeight: size + 'px',
        fontSize: size / 2 + 4,
        color: color
      });

      var styleIcon = {
        margin: 8
      };

      var iconElement = icon ? _react2.default.cloneElement(icon, {
        color: color,
        style: this.mergeStyles(styleIcon, icon.props.style)
      }) : null;

      return _react2.default.createElement(
        'div',
        _extends({}, other, {
          style: this.prepareStyles(styles.root, style),
          className: className
        }),
        iconElement,
        this.props.children
      );
    }
  }
});

exports.default = Avatar;
module.exports = exports['default'];