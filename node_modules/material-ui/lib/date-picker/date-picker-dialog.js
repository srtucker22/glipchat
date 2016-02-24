'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _contextPure = require('../mixins/context-pure');

var _contextPure2 = _interopRequireDefault(_contextPure);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _windowListenable = require('../mixins/window-listenable');

var _windowListenable2 = _interopRequireDefault(_windowListenable);

var _keyCode = require('../utils/key-code');

var _keyCode2 = _interopRequireDefault(_keyCode);

var _calendar = require('./calendar');

var _calendar2 = _interopRequireDefault(_calendar);

var _dialog = require('../dialog');

var _dialog2 = _interopRequireDefault(_dialog);

var _datePickerInline = require('./date-picker-inline');

var _datePickerInline2 = _interopRequireDefault(_datePickerInline);

var _flatButton = require('../flat-button');

var _flatButton2 = _interopRequireDefault(_flatButton);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _dateTime = require('../utils/date-time');

var _dateTime2 = _interopRequireDefault(_dateTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DatePickerDialog = _react2.default.createClass({
  displayName: 'DatePickerDialog',

  propTypes: {
    DateTimeFormat: _react2.default.PropTypes.func,
    autoOk: _react2.default.PropTypes.bool,
    container: _react2.default.PropTypes.oneOf(['dialog', 'inline']),
    disableYearSelection: _react2.default.PropTypes.bool,
    firstDayOfWeek: _react2.default.PropTypes.number,
    initialDate: _react2.default.PropTypes.object,
    locale: _react2.default.PropTypes.string,
    maxDate: _react2.default.PropTypes.object,
    minDate: _react2.default.PropTypes.object,
    mode: _react2.default.PropTypes.oneOf(['portrait', 'landscape']),
    onAccept: _react2.default.PropTypes.func,
    onDismiss: _react2.default.PropTypes.func,
    onShow: _react2.default.PropTypes.func,
    shouldDisableDate: _react2.default.PropTypes.func,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,
    wordings: _react2.default.PropTypes.object
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default, _windowListenable2.default, _contextPure2.default],

  statics: {
    getRelevantContextKeys: function getRelevantContextKeys(muiTheme) {
      return {
        calendarTextColor: muiTheme.datePicker.calendarTextColor
      };
    },
    getChildrenClasses: function getChildrenClasses() {
      return [_calendar2.default, _dialog2.default];
    }
  },

  getDefaultProps: function getDefaultProps() {
    return {
      DateTimeFormat: _dateTime2.default.DateTimeFormat,
      container: 'dialog',
      locale: 'en-US',
      wordings: {
        ok: 'OK',
        cancel: 'Cancel'
      }
    };
  },

  getInitialState: function getInitialState() {
    return {
      open: false,
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

  windowListeners: {
    keyup: '_handleWindowKeyUp'
  },

  show: function show() {
    if (this.props.onShow && !this.state.open) this.props.onShow();
    this.setState({
      open: true
    });
  },
  dismiss: function dismiss() {
    if (this.props.onDismiss && this.state.open) this.props.onDismiss();
    this.setState({
      open: false
    });
  },
  _onDayTouchTap: function _onDayTouchTap() {
    if (this.props.autoOk) {
      setTimeout(this._handleOKTouchTap, 300);
    }
  },
  _handleCancelTouchTap: function _handleCancelTouchTap() {
    this.dismiss();
  },
  _handleOKTouchTap: function _handleOKTouchTap() {
    if (this.props.onAccept && !this.refs.calendar.isSelectedDateDisabled()) {
      this.props.onAccept(this.refs.calendar.getSelectedDate());
    }

    this.dismiss();
  },
  _handleWindowKeyUp: function _handleWindowKeyUp(e) {
    if (this.state.open) {
      switch (e.keyCode) {
        case _keyCode2.default.ENTER:
          this._handleOKTouchTap();
          break;
      }
    }
  },
  render: function render() {
    var _props = this.props;
    var DateTimeFormat = _props.DateTimeFormat;
    var locale = _props.locale;
    var wordings = _props.wordings;
    var initialDate = _props.initialDate;
    var onAccept = _props.onAccept;
    var style = _props.style;
    var container = _props.container;
    var firstDayOfWeek = _props.firstDayOfWeek;

    var other = _objectWithoutProperties(_props, ['DateTimeFormat', 'locale', 'wordings', 'initialDate', 'onAccept', 'style', 'container', 'firstDayOfWeek']);

    var _constructor$getRelev = this.constructor.getRelevantContextKeys(this.state.muiTheme);

    var calendarTextColor = _constructor$getRelev.calendarTextColor;

    var styles = {
      root: {
        fontSize: 14,
        color: calendarTextColor
      },

      dialogContent: {
        width: this.props.mode === 'landscape' ? 480 : 320
      },

      dialogBodyContent: {
        padding: 0
      },

      actions: {
        marginRight: 8
      }
    };

    var actions = [_react2.default.createElement(_flatButton2.default, {
      key: 0,
      label: wordings.cancel,
      secondary: true,
      style: styles.actions,
      onTouchTap: this._handleCancelTouchTap
    })];

    if (!this.props.autoOk) {
      actions.push(_react2.default.createElement(_flatButton2.default, {
        key: 1,
        label: wordings.ok,
        secondary: true,
        disabled: this.refs.calendar !== undefined && this.refs.calendar.isSelectedDateDisabled(),
        style: styles.actions,
        onTouchTap: this._handleOKTouchTap
      }));
    }

    // will change later when Popover is available.
    var Container = container === 'inline' ? _datePickerInline2.default : _dialog2.default;
    return _react2.default.createElement(
      Container,
      _extends({}, other, {
        ref: 'dialog',
        style: styles.root,
        contentStyle: styles.dialogContent,
        bodyStyle: styles.dialogBodyContent,
        actions: actions,
        repositionOnUpdate: false,
        open: this.state.open,
        onRequestClose: this.dismiss
      }),
      _react2.default.createElement(_calendar2.default, {
        DateTimeFormat: DateTimeFormat,
        firstDayOfWeek: firstDayOfWeek,
        locale: locale,
        ref: 'calendar',
        onDayTouchTap: this._onDayTouchTap,
        initialDate: this.props.initialDate,
        open: this.state.open,
        minDate: this.props.minDate,
        maxDate: this.props.maxDate,
        shouldDisableDate: this.props.shouldDisableDate,
        disableYearSelection: this.props.disableYearSelection,
        mode: this.props.mode
      })
    );
  }
});

exports.default = DatePickerDialog;
module.exports = exports['default'];