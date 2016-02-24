'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _styles = require('../styles');

var _styles2 = _interopRequireDefault(_styles);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardTitle = _react2.default.createClass({
  displayName: 'CardTitle',

  propTypes: {
    actAsExpander: _react2.default.PropTypes.bool,
    children: _react2.default.PropTypes.node,
    expandable: _react2.default.PropTypes.bool,
    showExpandableButton: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,
    subtitle: _react2.default.PropTypes.node,
    subtitleColor: _react2.default.PropTypes.string,
    subtitleStyle: _react2.default.PropTypes.object,
    title: _react2.default.PropTypes.node,
    titleColor: _react2.default.PropTypes.string,
    titleStyle: _react2.default.PropTypes.object
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
      titleColor: _styles2.default.Colors.darkBlack,
      subtitleColor: _styles2.default.Colors.lightBlack
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
    this.setState({
      muiTheme: newMuiTheme
    });
  },
  getStyles: function getStyles() {
    return {
      root: {
        padding: 16,
        position: 'relative'
      },
      title: {
        fontSize: 24,
        color: this.props.titleColor,
        display: 'block',
        lineHeight: '36px'
      },
      subtitle: {
        fontSize: 14,
        color: this.props.subtitleColor,
        display: 'block'
      }
    };
  },
  render: function render() {
    var styles = this.getStyles();
    var rootStyle = this.mergeStyles(styles.root, this.props.style);
    var titleStyle = this.mergeStyles(styles.title, this.props.titleStyle);
    var subtitleStyle = this.mergeStyles(styles.subtitle, this.props.subtitleStyle);

    return _react2.default.createElement(
      'div',
      _extends({}, this.props, { style: this.prepareStyles(rootStyle) }),
      _react2.default.createElement(
        'span',
        { style: this.prepareStyles(titleStyle) },
        this.props.title
      ),
      _react2.default.createElement(
        'span',
        { style: this.prepareStyles(subtitleStyle) },
        this.props.subtitle
      ),
      this.props.children
    );
  }
});

exports.default = CardTitle;
module.exports = exports['default'];