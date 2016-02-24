'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _typography = require('../styles/typography');

var _typography2 = _interopRequireDefault(_typography);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubheaderMenuItem = _react2.default.createClass({
  displayName: 'SubheaderMenuItem',

  propTypes: {
    className: _react2.default.PropTypes.string,
    firstChild: _react2.default.PropTypes.bool,
    index: _react2.default.PropTypes.number.isRequired,
    style: _react2.default.PropTypes.object,
    text: _react2.default.PropTypes.string.isRequired
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

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
  getTheme: function getTheme() {
    return this.state.muiTheme.menuSubheader;
  },
  getSpacing: function getSpacing() {
    return this.state.muiTheme.rawTheme.spacing;
  },
  getStyles: function getStyles() {
    var gutterMini = this.getSpacing().desktopGutterMini;
    var subheaderHeight = this.getSpacing().desktopSubheaderHeight;
    var styles = {
      root: {
        boxSizing: 'border-box',
        fontSize: '13px',
        letterSpacing: 0,
        fontWeight: _typography2.default.fontWeightMedium,
        margin: 0,
        height: subheaderHeight + gutterMini,
        lineHeight: subheaderHeight + 'px',
        color: this.getTheme().textColor,
        borderTop: 'solid 1px ' + this.getTheme().borderColor,
        paddingTop: gutterMini,
        marginTop: gutterMini
      },
      rootWhenFirstChild: {
        height: subheaderHeight,
        borderTop: 'none',
        paddingTop: 0,
        marginTop: 0
      }
    };

    return styles;
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      {
        key: this.props.index,
        className: this.props.className,
        style: this.prepareStyles(this.getStyles().root, this.props.firstChild && this.getStyles().rootWhenFirstChild, this.props.style)
      },
      this.props.text
    );
  }
});

exports.default = SubheaderMenuItem;
module.exports = exports['default'];