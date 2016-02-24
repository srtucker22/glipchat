'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transitions = require('../styles/transitions');

var _transitions2 = _interopRequireDefault(_transitions);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('../utils/prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _paper = require('../paper');

var _paper2 = _interopRequireDefault(_paper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PopoverDefaultAnimation = _react2.default.createClass({
  displayName: 'PopoverDefaultAnimation',

  propTypes: {
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,
    open: _react2.default.PropTypes.bool.isRequired,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,
    targetOrigin: _propTypes2.default.origin,
    zDepth: _propTypes2.default.zDepth
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
      style: {},
      zDepth: 1
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      open: false
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this.setState({ open: true }); //eslint-disable-line react/no-did-mount-set-state
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;

    this.setState({
      open: nextProps.open,
      muiTheme: newMuiTheme
    });
  },
  getStyles: function getStyles() {
    var targetOrigin = this.props.targetOrigin;

    var horizontal = targetOrigin.horizontal.replace('middle', 'vertical');

    return {
      base: {
        opacity: 0,
        transform: 'scale(0, 0)',
        transformOrigin: horizontal + ' ' + targetOrigin.vertical,
        position: 'fixed',
        zIndex: this.state.muiTheme.zIndex.popover,
        transition: _transitions2.default.easeOut('250ms', ['transform', 'opacity']),
        maxHeight: '100%'

      },
      horizontal: {
        maxHeight: '100%',
        overflowY: 'auto',
        transform: 'scaleX(0)',
        opacity: 0,
        transformOrigin: horizontal + ' ' + targetOrigin.vertical,
        transition: _transitions2.default.easeOut('250ms', ['transform', 'opacity'])
      },
      vertical: {
        opacity: 0,
        transform: 'scaleY(0)',
        transformOrigin: horizontal + ' ' + targetOrigin.vertical,
        transition: _transitions2.default.easeOut('500ms', ['transform', 'opacity'])
      }
    };
  },
  getOpenStyles: function getOpenStyles() {
    return {
      base: {
        opacity: 1,
        transform: 'scale(1, 1)'
      },
      horizontal: {
        opacity: 1,
        transform: 'scaleX(1)'
      },
      vertical: {
        opacity: 1,
        transform: 'scaleY(1)'
      }
    };
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var style = _props.style;
    var zDepth = _props.zDepth;

    var styles = this.getStyles();
    var openStyles = {};
    if (this.state.open) openStyles = this.getOpenStyles();

    return _react2.default.createElement(
      _paper2.default,
      {
        style: this.mergeStyles(styles.base, style, openStyles.base),
        zDepth: zDepth,
        className: className
      },
      _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.horizontal, openStyles.horizontal) },
        _react2.default.createElement(
          'div',
          { style: this.prepareStyles(styles.vertical, openStyles.vertical) },
          this.props.children
        )
      )
    );
  }
});

exports.default = PopoverDefaultAnimation;
module.exports = exports['default'];