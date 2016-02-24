'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _windowListenable = require('../mixins/window-listenable');

var _windowListenable2 = _interopRequireDefault(_windowListenable);

var _dateTime = require('../utils/date-time');

var _dateTime2 = _interopRequireDefault(_dateTime);

var _datePickerDialog = require('./date-picker-dialog');

var _datePickerDialog2 = _interopRequireDefault(_datePickerDialog);

var _textField = require('../text-field');

var _textField2 = _interopRequireDefault(_textField);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _deprecatedPropType = require('../utils/deprecatedPropType');

var _deprecatedPropType2 = _interopRequireDefault(_deprecatedPropType);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var DatePicker = _react2.default.createClass({
  displayName: 'DatePicker',

  propTypes: {
    /**
     * Constructor for time formatting.
     * Follow this specificaction: ECMAScript Internationalization API 1.0 (ECMA-402).
     */
    DateTimeFormat: _react2.default.PropTypes.func,

    /**
     * If true, automatically accept and close the picker on select a date.
     */
    autoOk: _react2.default.PropTypes.bool,

    /**
     * Used to control how the DatePicker will be displayed when a user tries to set a date.
     * `dialog` (default) displays the DatePicker as a dialog with a modal.
     * `inline` displays the DatePicker below the input field (similar to auto complete).
     */
    container: _react2.default.PropTypes.oneOf(['dialog', 'inline']),

    /**
     * This is the initial date value of the component.
     * If either `value` or `valueLink` is provided they will override this
     * prop with `value` taking precedence.
     */
    defaultDate: _react2.default.PropTypes.object,

    /**
     * Disables the year selection in the date picker.
     */
    disableYearSelection: _react2.default.PropTypes.bool,

    /**
     * Disables the DatePicker.
     */
    disabled: _react2.default.PropTypes.bool,

    /**
     * Used to change the first day of week. It drastically varies from
     * Saturday to Monday (could even be Friday) between different locales.
     * The allowed range is 0 (Sunday) to 6 (Saturday).
     */
    firstDayOfWeek: _react2.default.PropTypes.number,

    /**
     * This function is called to format the date to display in the input box.
     * By default, date objects are formatted to MM/DD/YYYY.
     */
    formatDate: _react2.default.PropTypes.func,

    /**
     * Locale used for formatting date. If you are not using the default value, you
     * have to provide a DateTimeFormat that supports it. You can use Intl.DateTimeFormat
     * if it's supported by your environment.
     * https://github.com/andyearnshaw/Intl.js is a good polyfill.
     */
    locale: _react2.default.PropTypes.string,

    /**
     * The ending of a range of valid dates. The range includes the endDate.
     * The default value is current date + 100 years.
     */
    maxDate: _react2.default.PropTypes.object,

    /**
     * The beginning of a range of valid dates. The range includes the startDate.
     * The default value is current date - 100 years.
     */
    minDate: _react2.default.PropTypes.object,

    /**
     * Tells the component to display the picker in portrait or landscape mode.
     */
    mode: _react2.default.PropTypes.oneOf(['portrait', 'landscape']),

    /**
     * Callback function that is fired when the date value changes. Since there
     * is no particular event associated with the change the first argument
     * will always be null and the second argument will be the new Date instance.
     */
    onChange: _react2.default.PropTypes.func,

    /**
     * Fired when the datepicker dialog is dismissed.
     */
    onDismiss: _react2.default.PropTypes.func,

    /**
     * Callback function that is fired when the datepicker field gains focus.
     */
    onFocus: _react2.default.PropTypes.func,

    /**
     * Fired when the datepicker dialog is shown.
     */
    onShow: _react2.default.PropTypes.func,

    /**
     * Called when touch tap event occurs on text-field.
     */
    onTouchTap: _react2.default.PropTypes.func,

    /**
     * Called during render time of a given day. If this method returns
     * false the day is disabled otherwise it is displayed normally.
     */
    shouldDisableDate: _react2.default.PropTypes.func,

    /**
     *  Enables the year selection in the date picker.
     */
    showYearSelector: (0, _deprecatedPropType2.default)(_react2.default.PropTypes.bool, 'Instead, use disableYearSelection.'),

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * Override the inline-styles of DatePicker's TextField element.
     */
    textFieldStyle: _react2.default.PropTypes.object,

    /**
     * Sets the date for the Date Picker programmatically.
     */
    value: _react2.default.PropTypes.any,

    /**
     * Creates a ValueLink with the value of date picker.
     */
    valueLink: _react2.default.PropTypes.object,

    /**
     * Wordings used inside the button of the dialog.
     */
    wordings: _react2.default.PropTypes.object
  },

  contextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  //for passing default theme context to children
  childContextTypes: {
    muiTheme: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default, _windowListenable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      formatDate: _dateTime2.default.format,
      autoOk: false,
      disableYearSelection: false,
      style: {},
      firstDayOfWeek: 0,
      disabled: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      date: this._isControlled() ? this._getControlledDate() : this.props.defaultDate,
      dialogDate: new Date(),
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    if (nextContext.muiTheme) {
      this.setState({ muiTheme: nextContext.muiTheme });
    }

    if (this._isControlled()) {
      var newDate = this._getControlledDate(nextProps);
      if (!_dateTime2.default.isEqualDate(this.state.date, newDate)) {
        this.setState({
          date: newDate
        });
      }
    }
  },

  windowListeners: {
    keyup: '_handleWindowKeyUp'
  },

  getDate: function getDate() {
    return this.state.date;
  },
  setDate: function setDate(date) {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'setDate() method is deprecated. Use the defaultDate property instead.\n      Or use the DatePicker as a controlled component with the value property.') : undefined;

    this.setState({
      date: date
    });
  },

  /**
   * Open the date-picker dialog programmatically from a parent.
   */
  openDialog: function openDialog() {
    this.setState({
      dialogDate: this.getDate()
    }, this.refs.dialogWindow.show);
  },

  /**
   * Alias for `openDialog()` for an api consistent with TextField.
   */
  focus: function focus() {
    this.openDialog();
  },
  _handleDialogAccept: function _handleDialogAccept(date) {
    if (!this._isControlled()) {
      this.setState({
        date: date
      });
    }
    if (this.props.onChange) this.props.onChange(null, date);
    if (this.props.valueLink) this.props.valueLink.requestChange(date);
  },
  _handleInputFocus: function _handleInputFocus(e) {
    e.target.blur();
    if (this.props.onFocus) this.props.onFocus(e);
  },

  _handleInputTouchTap: function _handleInputTouchTap(event) {
    var _this = this;

    if (this.props.onTouchTap) this.props.onTouchTap(event);

    if (!this.props.disabled) setTimeout(function () {
      _this.openDialog();
    }, 0);
  },

  _handleWindowKeyUp: function _handleWindowKeyUp() {
    //TO DO: open the dialog if input has focus
  },
  _isControlled: function _isControlled() {
    return this.props.hasOwnProperty('value') || this.props.hasOwnProperty('valueLink');
  },
  _getControlledDate: function _getControlledDate() {
    var props = arguments.length <= 0 || arguments[0] === undefined ? this.props : arguments[0];

    if (_dateTime2.default.isDateObject(props.value)) {
      return props.value;
    } else if (props.valueLink && _dateTime2.default.isDateObject(props.valueLink.value)) {
      return props.valueLink.value;
    }
  },
  render: function render() {
    var _props = this.props;
    var container = _props.container;
    var DateTimeFormat = _props.DateTimeFormat;
    var locale = _props.locale;
    var wordings = _props.wordings;
    var autoOk = _props.autoOk;
    var defaultDate = _props.defaultDate;
    var formatDate = _props.formatDate;
    var maxDate = _props.maxDate;
    var minDate = _props.minDate;
    var mode = _props.mode;
    var onDismiss = _props.onDismiss;
    var onFocus = _props.onFocus;
    var onShow = _props.onShow;
    var onTouchTap = _props.onTouchTap;
    var disableYearSelection = _props.disableYearSelection;
    var style = _props.style;
    var textFieldStyle = _props.textFieldStyle;
    var valueLink = _props.valueLink;
    var firstDayOfWeek = _props.firstDayOfWeek;

    var other = _objectWithoutProperties(_props, ['container', 'DateTimeFormat', 'locale', 'wordings', 'autoOk', 'defaultDate', 'formatDate', 'maxDate', 'minDate', 'mode', 'onDismiss', 'onFocus', 'onShow', 'onTouchTap', 'disableYearSelection', 'style', 'textFieldStyle', 'valueLink', 'firstDayOfWeek']);

    return _react2.default.createElement(
      'div',
      { style: this.prepareStyles(style) },
      _react2.default.createElement(_textField2.default, _extends({}, other, {
        style: textFieldStyle,
        ref: 'input',
        value: this.state.date ? formatDate(this.state.date) : undefined,
        onFocus: this._handleInputFocus,
        onTouchTap: this._handleInputTouchTap
      })),
      _react2.default.createElement(_datePickerDialog2.default, {
        container: container,
        ref: 'dialogWindow',
        DateTimeFormat: DateTimeFormat,
        locale: locale,
        wordings: wordings,
        mode: mode,
        initialDate: this.state.dialogDate,
        onAccept: this._handleDialogAccept,
        onShow: onShow,
        onDismiss: onDismiss,
        minDate: minDate,
        maxDate: maxDate,
        autoOk: autoOk,
        disableYearSelection: disableYearSelection,
        shouldDisableDate: this.props.shouldDisableDate,
        firstDayOfWeek: firstDayOfWeek
      })
    );
  }
});

exports.default = DatePicker;
module.exports = exports['default'];