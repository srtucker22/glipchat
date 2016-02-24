'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GridTile = _react2.default.createClass({
  displayName: 'GridTile',

  propTypes: {
    /**
     * An IconButton element to be used as secondary action target
     * (primary action target is the tile itself).
     */
    actionIcon: _react2.default.PropTypes.element,

    /**
     * Position of secondary action IconButton.
     */
    actionPosition: _react2.default.PropTypes.oneOf(['left', 'right']),

    /**
     * Theoretically you can pass any node as children, but the main use case is to pass an img,
     * in whichcase GridTile takes care of making the image "cover" available space
     * (similar to background-size: cover or to object-fit:cover).
     */
    children: _react2.default.PropTypes.node,

    /**
     * Width of the tile in number of grid cells.
     */
    cols: _react2.default.PropTypes.number,

    /**
     * Either a string used as tag name for the tile root element, or a ReactComponent.
     * This is useful when you have, for example, a custom implementation of
     * a navigation link (that knowsabout your routes) and you want to use it as primary tile action.
     * In case you pass a ReactComponent, please make sure that it passes all props,
     * accepts styles overrides and render it's children.
     */
    rootClass: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.object]),

    /**
     * Height of the tile in number of grid cells.
     */
    rows: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * String or element serving as subtitle (support text).
     */
    subtitle: _react2.default.PropTypes.node,

    /**
     * Title to be displayed on tile.
     */
    title: _react2.default.PropTypes.node,

    /**
     * Style used for title bar background.
     * Useful for setting custom gradients for example
     */
    titleBackground: _react2.default.PropTypes.string,

    /**
     * Position of the title bar (container of title, subtitle and action icon).
     */
    titlePosition: _react2.default.PropTypes.oneOf(['top', 'bottom'])
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
      titlePosition: 'bottom',
      titleBackground: 'rgba(0, 0, 0, 0.4)',
      actionPosition: 'right',
      cols: 1,
      rows: 1,
      rootClass: 'div'
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
  componentDidMount: function componentDidMount() {
    this._ensureImageCover();
  },

  //to update theme inside state whenever a new theme is passed down
  //from the parent / owner using context
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({ muiTheme: newMuiTheme });
  },
  getStyles: function getStyles() {
    var _titleBar;

    var spacing = this.state.muiTheme.rawTheme.spacing;
    var themeVariables = this.state.muiTheme.gridTile;
    var actionPos = this.props.actionIcon ? this.props.actionPosition : null;
    var gutterLess = spacing.desktopGutterLess;

    var styles = {
      root: {
        position: 'relative',
        display: 'block',
        height: '100%',
        overflow: 'hidden'
      },
      titleBar: (_titleBar = {
        position: 'absolute',
        left: 0,
        right: 0
      }, _defineProperty(_titleBar, this.props.titlePosition, 0), _defineProperty(_titleBar, 'height', this.props.subtitle ? 68 : 48), _defineProperty(_titleBar, 'background', this.props.titleBackground), _defineProperty(_titleBar, 'display', 'flex'), _defineProperty(_titleBar, 'alignItems', 'center'), _titleBar),
      titleWrap: {
        flexGrow: 1,
        marginLeft: actionPos !== 'left' ? gutterLess : 0,
        marginRight: actionPos === 'left' ? gutterLess : 0,
        color: themeVariables.textColor,
        overflow: 'hidden'
      },
      title: {
        fontSize: '16px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      subtitle: {
        fontSize: '12px',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap'
      },
      actionIcon: {
        order: actionPos === 'left' ? -1 : 1
      },
      childImg: {
        height: '100%',
        transform: 'translateX(-50%)',
        position: 'relative',
        left: '50%'
      }
    };
    return styles;
  },
  componeneDidUpdate: function componeneDidUpdate() {
    this._ensureImageCover();
  },
  _ensureImageCover: function _ensureImageCover() {
    var imgEl = _reactDom2.default.findDOMNode(this.refs.img);

    if (imgEl) {
      (function () {
        var fit = function fit() {
          if (imgEl.offsetWidth < imgEl.parentNode.offsetWidth) {
            imgEl.style.height = 'auto';
            imgEl.style.left = '0';
            imgEl.style.width = '100%';
            imgEl.style.top = '50%';
            imgEl.style.transform = imgEl.style.WebkitTransform = 'translateY(-50%)';
          }
          imgEl.removeEventListener('load', fit);
          imgEl = null; // prevent closure memory leak
        };
        if (imgEl.complete) {
          fit();
        } else {
          imgEl.addEventListener('load', fit);
        }
      })();
    }
  },
  render: function render() {
    var _this = this;

    var _props = this.props;
    var title = _props.title;
    var subtitle = _props.subtitle;
    var titlePosition = _props.titlePosition;
    var titleBackground = _props.titleBackground;
    var actionIcon = _props.actionIcon;
    var actionPosition = _props.actionPosition;
    var style = _props.style;
    var children = _props.children;
    var rootClass = _props.rootClass;

    var other = _objectWithoutProperties(_props, ['title', 'subtitle', 'titlePosition', 'titleBackground', 'actionIcon', 'actionPosition', 'style', 'children', 'rootClass']);

    var styles = this.getStyles();

    var mergedRootStyles = this.mergeStyles(styles.root, style);

    var titleBar = null;

    if (title) {
      titleBar = _react2.default.createElement(
        'div',
        { style: this.prepareStyles(styles.titleBar) },
        _react2.default.createElement(
          'div',
          { style: this.prepareStyles(styles.titleWrap) },
          _react2.default.createElement(
            'div',
            { style: this.prepareStyles(styles.title) },
            title
          ),
          subtitle ? _react2.default.createElement(
            'div',
            { style: this.prepareStyles(styles.subtitle) },
            subtitle
          ) : null
        ),
        actionIcon ? _react2.default.createElement(
          'div',
          { style: this.prepareStyles(styles.actionIcon) },
          actionIcon
        ) : null
      );
    }

    var newChildren = children;

    // if there is an image passed as children
    // clone it an put our styles
    if (_react2.default.Children.count(children) === 1) {
      newChildren = _react2.default.Children.map(children, function (child) {
        if (child.type === 'img') {
          return _react2.default.cloneElement(child, {
            ref: 'img',
            style: _this.prepareStyles(styles.childImg, child.props.style)
          });
        } else {
          return child;
        }
      });
    }

    var RootTag = rootClass;
    return _react2.default.createElement(
      RootTag,
      _extends({ style: this.prepareStyles(mergedRootStyles) }, other),
      newChildren,
      titleBar
    );
  }
});

exports.default = GridTile;
module.exports = exports['default'];