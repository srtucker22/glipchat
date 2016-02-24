'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _keyboardArrowUp = require('../svg-icons/hardware/keyboard-arrow-up');

var _keyboardArrowUp2 = _interopRequireDefault(_keyboardArrowUp);

var _keyboardArrowDown = require('../svg-icons/hardware/keyboard-arrow-down');

var _keyboardArrowDown2 = _interopRequireDefault(_keyboardArrowDown);

var _iconButton = require('../icon-button');

var _iconButton2 = _interopRequireDefault(_iconButton);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _contextPure = require('../mixins/context-pure');

var _contextPure2 = _interopRequireDefault(_contextPure);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CardExpandable = _react2.default.createClass({
  displayName: 'CardExpandable',

  propTypes: {
    expanded: _react2.default.PropTypes.bool,
    onExpanding: _react2.default.PropTypes.func.isRequired,

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

  mixins: [_stylePropable2.default, _contextPure2.default],

  statics: {
    getRelevantContextKeys: function getRelevantContextKeys(muiTheme) {
      return {
        isRtl: muiTheme.isRtl
      };
    },
    getChildrenClasses: function getChildrenClasses() {
      return [_iconButton2.default];
    }
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
  getStyles: function getStyles() {
    var contextKeys = this.constructor.getRelevantContextKeys(this.state.muiTheme);

    var directionStyle = contextKeys.isRtl ? {
      left: 4
    } : {
      right: 4
    };

    return {
      root: this.mergeStyles({
        top: 0,
        bottom: 0,
        margin: 'auto',
        position: 'absolute'
      }, directionStyle)
    };
  },
  render: function render() {
    var styles = this.getStyles();

    var expandable = undefined;
    if (this.props.expanded === true) expandable = _react2.default.createElement(_keyboardArrowUp2.default, null);else expandable = _react2.default.createElement(_keyboardArrowDown2.default, null);

    var mergedStyles = this.mergeStyles(styles.root, this.props.style);

    var expandableBtn = _react2.default.createElement(
      _iconButton2.default,
      {
        style: mergedStyles,
        onTouchTap: this.props.onExpanding
      },
      expandable
    );

    return expandableBtn;
  }
});

exports.default = CardExpandable;
module.exports = exports['default'];