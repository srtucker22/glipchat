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

var _clickAwayable = require('./mixins/click-awayable');

var _clickAwayable2 = _interopRequireDefault(_clickAwayable);

var _flatButton = require('./flat-button');

var _flatButton2 = _interopRequireDefault(_flatButton);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _contextPure = require('./mixins/context-pure');

var _contextPure2 = _interopRequireDefault(_contextPure);

var _styleResizable = require('./mixins/style-resizable');

var _styleResizable2 = _interopRequireDefault(_styleResizable);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

var _deprecatedPropType = require('./utils/deprecatedPropType');

var _deprecatedPropType2 = _interopRequireDefault(_deprecatedPropType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Snackbar = _react2.default.createClass({
  displayName: 'Snackbar',

  propTypes: {
    /**
     * The label for the action on the snackbar.
     */
    action: _react2.default.PropTypes.string,

    /**
     * The number of milliseconds to wait before automatically dismissing.
     * If no value is specified the snackbar will dismiss normally.
     * If a value is provided the snackbar can still be dismissed normally.
     * If a snackbar is dismissed before the timer expires, the timer will be cleared.
     */
    autoHideDuration: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the body element.
     */
    bodyStyle: _react2.default.PropTypes.object,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * The message to be displayed.
     */
    message: _react2.default.PropTypes.node.isRequired,

    /**
     * Fired when the action button is touchtapped.
     *
     * @param {object} event Action button event.
     */
    onActionTouchTap: _react2.default.PropTypes.func,

    /**
     * Fired when the `Snackbar` is dismissed.
     */
    onDismiss: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.func, 'Instead, use the open property to control the component.'),

    /**
     * Fired when the `Snackbar` is requested to be closed by a click outside the `Snackbar`, or after the
     * `autoHideDuration` timer expires.
     *
     * Typically `onRequestClose` is used to set state in the parent component, which is used to control the `Snackbar`
     * `open` prop.
     *
     * The `reason` parameter can optionally be used to control the response to `onRequestClose`,
     * for example ignoring `clickaway`.
     *
     * @param {string} reason Can be:`"timeout"` (`autoHideDuration` expired) or: `"clickaway"`
     */
    onRequestClose: _react2.default.PropTypes.func.isRequired,

    /**
     * Fired when the `Snackbar` is shown.
     */
    onShow: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.func, 'Instead, use the open property to control the component.'),

    /**
     * Controls whether the `Snackbar` is opened or not.
     */
    open: _react2.default.PropTypes.bool.isRequired,

    /**
     * If true, the `Snackbar` will open once mounted.
     */
    openOnMount: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.bool, 'Instead, use the open property to control the component.'),

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

  mixins: [_stylePropable2.default, _styleResizable2.default, _clickAwayable2.default, _contextPure2.default],

  statics: {
    getRelevantContextKeys: function getRelevantContextKeys(muiTheme) {
      var theme = muiTheme.snackbar;
      var spacing = muiTheme.rawTheme.spacing;

      return {
        textColor: theme.textColor,
        backgroundColor: theme.backgroundColor,
        desktopGutter: spacing.desktopGutter,
        desktopSubheaderHeight: spacing.desktopSubheaderHeight,
        actionColor: theme.actionColor
      };
    },
    getChildrenClasses: function getChildrenClasses() {
      return [_flatButton2.default];
    }
  },

  getInitialState: function getInitialState() {
    var open = this.props.open;

    if (open === null) {
      open = this.props.openOnMount;
    }

    return {
      open: open,
      message: this.props.message,
      action: this.props.action,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    var _this = this;

    if (this.state.open) {
      this._setAutoHideTimer();

      //Only Bind clickaway after transition finishes
      this.timerTransitionId = setTimeout(function () {
        _this._bindClickAway();
      }, 400);
    }
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var _this2 = this;

    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme
    });

    if (this.state.open && nextProps.open === this.props.open && (nextProps.message !== this.props.message || nextProps.action !== this.props.action)) {
      this.setState({
        open: false
      });

      clearTimeout(this.timerOneAtTheTimeId);
      this.timerOneAtTheTimeId = setTimeout(function () {
        _this2.setState({
          message: nextProps.message,
          action: nextProps.action,
          open: true
        });
      }, 400);
    } else {
      var open = nextProps.open;

      this.setState({
        open: open !== null ? open : this.state.open,
        message: nextProps.message,
        action: nextProps.action
      });
    }
  },
  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    var _this3 = this;

    if (prevState.open !== this.state.open) {
      if (this.state.open) {
        this._setAutoHideTimer();

        //Only Bind clickaway after transition finishes
        this.timerTransitionId = setTimeout(function () {
          _this3._bindClickAway();
        }, 400);
      } else {
        clearTimeout(this.timerAutoHideId);
        this._unbindClickAway();
      }
    }
  },
  componentWillUnmount: function componentWillUnmount() {
    clearTimeout(this.timerAutoHideId);
    clearTimeout(this.timerTransitionId);
    clearTimeout(this.timerOneAtTheTimeId);
    this._unbindClickAway();
  },

  manuallyBindClickAway: true,

  timerAutoHideId: undefined,
  timerTransitionId: undefined,
  timerOneAtTheTimeId: undefined,

  componentClickAway: function componentClickAway() {
    if (this.props.open !== null && this.props.onRequestClose) {
      this.props.onRequestClose('clickaway');
    } else {
      this.setState({ open: false });
    }
  },
  getStyles: function getStyles() {
    var _constructor$getRelev = this.constructor.getRelevantContextKeys(this.state.muiTheme);

    var textColor = _constructor$getRelev.textColor;
    var backgroundColor = _constructor$getRelev.backgroundColor;
    var desktopGutter = _constructor$getRelev.desktopGutter;
    var desktopSubheaderHeight = _constructor$getRelev.desktopSubheaderHeight;
    var actionColor = _constructor$getRelev.actionColor;

    var isSmall = this.state.deviceSize === this.constructor.Sizes.SMALL;

    var styles = {
      root: {
        position: 'fixed',
        left: 0,
        display: 'flex',
        right: 0,
        bottom: 0,
        zIndex: this.state.muiTheme.zIndex.snackbar,
        visibility: 'hidden',
        transform: 'translate3d(0, ' + desktopSubheaderHeight + 'px, 0)',
        transition: _transitions2.default.easeOut('400ms', 'transform') + ',' + _transitions2.default.easeOut('400ms', 'visibility')
      },
      rootWhenOpen: {
        visibility: 'visible',
        transform: 'translate3d(0, 0, 0)'
      },
      body: {
        backgroundColor: backgroundColor,
        padding: '0 ' + desktopGutter + 'px',
        height: desktopSubheaderHeight,
        lineHeight: desktopSubheaderHeight + 'px',
        borderRadius: isSmall ? 0 : 2,
        maxWidth: isSmall ? 'inherit' : 568,
        minWidth: isSmall ? 'inherit' : 288,
        flexGrow: isSmall ? 1 : 0,
        margin: 'auto'
      },
      content: {
        fontSize: 14,
        color: textColor,
        opacity: 0,
        transition: _transitions2.default.easeOut('400ms', 'opacity')
      },
      contentWhenOpen: {
        opacity: 1,
        transition: _transitions2.default.easeOut('500ms', 'opacity', '100ms')
      },
      action: {
        color: actionColor,
        float: 'right',
        marginTop: 6,
        marginRight: -16,
        marginLeft: desktopGutter,
        backgroundColor: 'transparent'
      }
    };

    return styles;
  },
  show: function show() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'show has been deprecated in favor of explicitly setting the open property.') : undefined;

    this.setState({
      open: true
    });

    if (this.props.onShow) {
      this.props.onShow();
    }
  },
  _onDismiss: function _onDismiss() {
    if (this.props.onDismiss) {
      this.props.onDismiss();
    }
  },
  dismiss: function dismiss() {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'dismiss has been deprecated in favor of explicitly setting the open property.') : undefined;

    this.setState({
      open: false
    }, this._onDismiss);
  },
  _setAutoHideTimer: function _setAutoHideTimer() {
    var _this4 = this;

    var autoHideDuration = this.props.autoHideDuration;

    if (autoHideDuration > 0) {
      clearTimeout(this.timerAutoHideId);
      this.timerAutoHideId = setTimeout(function () {
        if (_this4.props.open !== null && _this4.props.onRequestClose) {
          _this4.props.onRequestClose('timeout');
        } else {
          _this4.setState({ open: false });
        }
      }, autoHideDuration);
    }
  },
  render: function render() {
    var _props = this.props;
    var onActionTouchTap = _props.onActionTouchTap;
    var style = _props.style;
    var bodyStyle = _props.bodyStyle;

    var others = _objectWithoutProperties(_props, ['onActionTouchTap', 'style', 'bodyStyle']);

    var styles = this.getStyles();

    var _state = this.state;
    var open = _state.open;
    var action = _state.action;
    var message = _state.message;

    var rootStyles = open ? this.mergeStyles(styles.root, styles.rootWhenOpen, style) : this.mergeStyles(styles.root, style);

    var actionButton = undefined;
    if (action) {
      actionButton = _react2.default.createElement(_flatButton2.default, {
        style: styles.action,
        label: action,
        onTouchTap: onActionTouchTap
      });
    }

    var mergedBodyStyle = this.mergeStyles(styles.body, bodyStyle);

    var contentStyle = open ? this.mergeStyles(styles.content, styles.contentWhenOpen) : styles.content;

    return _react2.default.createElement(
      'div',
      _extends({}, others, { style: rootStyles }),
      _react2.default.createElement(
        'div',
        { style: mergedBodyStyle },
        _react2.default.createElement(
          'div',
          { style: contentStyle },
          _react2.default.createElement(
            'span',
            null,
            message
          ),
          actionButton
        )
      )
    );
  }
});

exports.default = Snackbar;
module.exports = exports['default'];