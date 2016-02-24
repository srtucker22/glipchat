'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _radioButton = require('./radio-button');

var _radioButton2 = _interopRequireDefault(_radioButton);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var RadioButtonGroup = _react2.default.createClass({
  displayName: 'RadioButtonGroup',

  propTypes: {
    /**
     * Should be used to pass `RadioButton` components.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Sets the default radio button to be the one whose
     * value matches defaultSelected (case-sensitive).
     * This will override any individual radio button with
     * the defaultChecked or checked property stated.
     */
    defaultSelected: _react2.default.PropTypes.string,

    /**
     * Where the label will be placed for all radio buttons.
     * This will override any labelPosition properties defined
     * for an individual radio button.
     */
    labelPosition: _react2.default.PropTypes.oneOf(['left', 'right']),

    /**
     * The name that will be applied to all radio buttons inside it.
     */
    name: _react2.default.PropTypes.string.isRequired,

    /**
     * Callback function that is fired when a radio button has
     * been clicked. Returns the event and the value of the radio
     * button that has been selected.
     */
    onChange: _react2.default.PropTypes.func,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,

    /**
     * The value of the currently selected radio button.
     */
    valueSelected: _react2.default.PropTypes.string
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
      style: {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      numberCheckedRadioButtons: 0,
      selected: this.props.valueSelected || this.props.defaultSelected || '',
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentWillMount: function componentWillMount() {
    var _this = this;

    var cnt = 0;

    _react2.default.Children.forEach(this.props.children, function (option) {
      if (_this._hasCheckAttribute(option)) cnt++;
    }, this);

    this.setState({ numberCheckedRadioButtons: cnt });
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    var newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    var newState = { muiTheme: newMuiTheme };

    if (nextProps.hasOwnProperty('valueSelected')) {
      newState.selected = nextProps.valueSelected;
    }

    this.setState(newState);
  },
  _hasCheckAttribute: function _hasCheckAttribute(radioButton) {
    return radioButton.props.hasOwnProperty('checked') && radioButton.props.checked;
  },
  _updateRadioButtons: function _updateRadioButtons(newSelection) {
    if (this.state.numberCheckedRadioButtons === 0) {
      this.setState({ selected: newSelection });
    } else {
      process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'Cannot select a different radio button while another radio button\n        has the \'checked\' property set to true.') : undefined;
    }
  },
  _onChange: function _onChange(e, newSelection) {
    this._updateRadioButtons(newSelection);

    // Successful update
    if (this.state.numberCheckedRadioButtons === 0) {
      if (this.props.onChange) this.props.onChange(e, newSelection);
    }
  },
  getSelectedValue: function getSelectedValue() {
    return this.state.selected;
  },
  setSelectedValue: function setSelectedValue(newSelectionValue) {
    this._updateRadioButtons(newSelectionValue);
  },
  clearValue: function clearValue() {
    this.setSelectedValue('');
  },
  render: function render() {
    var _this2 = this;

    var options = _react2.default.Children.map(this.props.children, function (option) {
      var _option$props = option.props;
      var name = _option$props.name;
      var value = _option$props.value;
      var label = _option$props.label;
      var onCheck = _option$props.onCheck;

      var other = _objectWithoutProperties(_option$props, ['name', 'value', 'label', 'onCheck']);

      return _react2.default.createElement(_radioButton2.default, _extends({}, other, {
        ref: option.props.value,
        name: _this2.props.name,
        key: option.props.value,
        value: option.props.value,
        label: option.props.label,
        labelPosition: _this2.props.labelPosition,
        onCheck: _this2._onChange,
        checked: option.props.value === _this2.state.selected
      }));
    }, this);

    return _react2.default.createElement(
      'div',
      {
        style: this.prepareStyles(this.props.style),
        className: this.props.className
      },
      options
    );
  }
});

exports.default = RadioButtonGroup;
module.exports = exports['default'];