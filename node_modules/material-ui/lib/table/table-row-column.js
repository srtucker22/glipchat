'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TableRowColumn = _react2.default.createClass({
  displayName: 'TableRowColumn',

  propTypes: {
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Number to identify the header row. This property
     * is automatically populated when used with TableHeader.
     */
    columnNumber: _react2.default.PropTypes.number,

    /**
     * If true, this column responds to hover events.
     */
    hoverable: _react2.default.PropTypes.bool,

    /**
     * Key for this element.
     */
    key: _react2.default.PropTypes.string,

    /**
     * Callback function for click event.
     */
    onClick: _react2.default.PropTypes.func,

    /**
     * Callback function for hover event.
     */
    onHover: _react2.default.PropTypes.func,

    /**
     * Callback function for hover exit event.
     */
    onHoverExit: _react2.default.PropTypes.func,

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
      hoverable: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      hovered: false
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
    return this.state.muiTheme.tableRowColumn;
  },
  getStyles: function getStyles() {
    var theme = this.getTheme();
    var styles = {
      root: {
        paddingLeft: theme.spacing,
        paddingRight: theme.spacing,
        height: theme.height,
        textAlign: 'left',
        fontSize: 13,
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    };

    if (_react2.default.Children.count(this.props.children) === 1 && !isNaN(this.props.children)) {
      styles.textAlign = 'right';
    }

    return styles;
  },
  _onClick: function _onClick(e) {
    if (this.props.onClick) this.props.onClick(e, this.props.columnNumber);
  },
  _onMouseEnter: function _onMouseEnter(e) {
    if (this.props.hoverable) {
      this.setState({ hovered: true });
      if (this.props.onHover) this.props.onHover(e, this.props.columnNumber);
    }
  },
  _onMouseLeave: function _onMouseLeave(e) {
    if (this.props.hoverable) {
      this.setState({ hovered: false });
      if (this.props.onHoverExit) this.props.onHoverExit(e, this.props.columnNumber);
    }
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var columnNumber = _props.columnNumber;
    var hoverable = _props.hoverable;
    var onClick = _props.onClick;
    var onHover = _props.onHover;
    var onHoverExit = _props.onHoverExit;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['className', 'columnNumber', 'hoverable', 'onClick', 'onHover', 'onHoverExit', 'style']);

    var styles = this.getStyles();
    var handlers = {
      onClick: this._onClick,
      onMouseEnter: this._onMouseEnter,
      onMouseLeave: this._onMouseLeave
    };

    return _react2.default.createElement(
      'td',
      _extends({
        key: this.props.key,
        className: className,
        style: this.prepareStyles(styles.root, style)
      }, handlers, other),
      this.props.children
    );
  }
});

exports.default = TableRowColumn;
module.exports = exports['default'];