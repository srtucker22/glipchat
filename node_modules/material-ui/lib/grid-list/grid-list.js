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

var GridList = _react2.default.createClass({
  displayName: 'GridList',

  propTypes: {
    /**
     * Number of px for one cell height.
     */
    cellHeight: _react2.default.PropTypes.number,

    /**
     * Grid Tiles that will be in Grid List.
     */
    children: _react2.default.PropTypes.node,

    /**
     * Number of columns.
     */
    cols: _react2.default.PropTypes.number,

    /**
     * Number of px for the padding/spacing between items.
     */
    padding: _react2.default.PropTypes.number,

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
      cols: 2,
      padding: 4,
      cellHeight: 180
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
  getStyles: function getStyles() {
    return {
      root: {
        display: 'flex',
        flexWrap: 'wrap',
        margin: -this.props.padding / 2
      },
      item: {
        boxSizing: 'border-box',
        padding: this.props.padding / 2
      }
    };
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var cols = _props.cols;
    var padding = _props.padding;
    var cellHeight = _props.cellHeight;
    var children = _props.children;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['cols', 'padding', 'cellHeight', 'children', 'style']);

    var styles = this.getStyles();

    var mergedRootStyles = this.mergeStyles(styles.root, style);

    var wrappedChildren = _react2.default.Children.map(children, function (currentChild) {
      var childCols = currentChild.props.cols || 1;
      var childRows = currentChild.props.rows || 1;
      var itemStyle = _this.mergeStyles(styles.item, {
        width: 100 / cols * childCols + '%',
        height: cellHeight * childRows + padding
      });

      return _react2.default.createElement(
        'div',
        { style: _this.prepareStyles(itemStyle) },
        currentChild
      );
    });

    return _react2.default.createElement(
      'div',
      _extends({ style: this.prepareStyles(mergedRootStyles) }, other),
      wrappedChildren
    );
  }
});

exports.default = GridList;
module.exports = exports['default'];