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

var CardMedia = _react2.default.createClass({
  displayName: 'CardMedia',

  propTypes: {
    actAsExpander: _react2.default.PropTypes.bool,
    children: _react2.default.PropTypes.node,
    expandable: _react2.default.PropTypes.bool,
    mediaStyle: _react2.default.PropTypes.object,
    overlay: _react2.default.PropTypes.node,
    overlayContainerStyle: _react2.default.PropTypes.object,
    overlayContentStyle: _react2.default.PropTypes.object,
    overlayStyle: _react2.default.PropTypes.object,

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
        position: 'relative'
      },
      overlayContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        left: 0
      },
      overlay: {
        height: '100%',
        position: 'relative'
      },
      overlayContent: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        paddingTop: 8,
        background: _styles2.default.Colors.lightBlack
      },
      media: {},
      mediaChild: {
        verticalAlign: 'top',
        maxWidth: '100%',
        minWidth: '100%',
        width: '100%'
      }
    };
  },
  render: function render() {
    var _this = this;

    var styles = this.getStyles();
    var rootStyle = this.mergeStyles(styles.root, this.props.style);
    var mediaStyle = this.mergeStyles(styles.media, this.props.mediaStyle);
    var overlayContainerStyle = this.mergeStyles(styles.overlayContainer, this.props.overlayContainerStyle);
    var overlayContentStyle = this.mergeStyles(styles.overlayContent, this.props.overlayContentStyle);
    var overlayStyle = this.mergeStyles(styles.overlay, this.props.overlayStyle);

    var children = _react2.default.Children.map(this.props.children, function (child) {
      return _react2.default.cloneElement(child, { style: _this.prepareStyles(styles.mediaChild, child.props.style) });
    });

    var overlayChildren = _react2.default.Children.map(this.props.overlay, function (child) {
      if (child.type.displayName === 'CardHeader' || child.type.displayName === 'CardTitle') {
        return _react2.default.cloneElement(child, {
          titleColor: _styles2.default.Colors.darkWhite,
          subtitleColor: _styles2.default.Colors.lightWhite
        });
      } else if (child.type.displayName === 'CardText') {
        return _react2.default.cloneElement(child, {
          color: _styles2.default.Colors.darkWhite
        });
      } else {
        return child;
      }
    });

    return _react2.default.createElement(
      'div',
      _extends({}, this.props, { style: this.prepareStyles(rootStyle) }),
      _react2.default.createElement(
        'div',
        { style: this.prepareStyles(mediaStyle) },
        children
      ),
      this.props.overlay ? _react2.default.createElement(
        'div',
        { style: this.prepareStyles(overlayContainerStyle) },
        _react2.default.createElement(
          'div',
          { style: this.prepareStyles(overlayStyle) },
          _react2.default.createElement(
            'div',
            { style: this.prepareStyles(overlayContentStyle) },
            overlayChildren
          )
        )
      ) : ''
    );
  }
});

exports.default = CardMedia;
module.exports = exports['default'];