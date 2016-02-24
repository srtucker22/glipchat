'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _stylePropable = require('./mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('./styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var rowsHeight = 24;

var styles = {
  textarea: {
    width: '100%',
    resize: 'none',
    font: 'inherit',
    padding: 0
  },
  shadow: {
    width: '100%',
    resize: 'none',
    // Overflow also needed to here to remove the extra row
    // added to textareas in Firefox.
    overflow: 'hidden',
    // Visibility needed to hide the extra text area on ipads
    visibility: 'hidden',
    font: 'inherit',
    padding: 0,
    position: 'absolute'
  }
};

var EnhancedTextarea = _react2.default.createClass({
  displayName: 'EnhancedTextarea',

  propTypes: {
    defaultValue: _react2.default.PropTypes.any,
    disabled: _react2.default.PropTypes.bool,
    onChange: _react2.default.PropTypes.func,
    onHeightChange: _react2.default.PropTypes.func,
    rows: _react2.default.PropTypes.number,
    rowsMax: _react2.default.PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object,
    textareaStyle: _react2.default.PropTypes.object,
    value: _react2.default.PropTypes.string,
    valueLink: _react2.default.PropTypes.object
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
      rows: 1
    };
  },
  getInitialState: function getInitialState() {
    return {
      height: this.props.rows * rowsHeight,
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)()
    };
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: this.state.muiTheme
    };
  },
  componentDidMount: function componentDidMount() {
    this._syncHeightWithShadow();
  },
  componentWillReceiveProps: function componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.value !== this.props.value) {
      this._syncHeightWithShadow(nextProps.value);
    }
    var newState = {};
    newState.muiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
  },
  getInputNode: function getInputNode() {
    return _reactDom2.default.findDOMNode(this.refs.input);
  },
  setValue: function setValue(value) {
    this.getInputNode().value = value;
    this._syncHeightWithShadow(value);
  },
  _syncHeightWithShadow: function _syncHeightWithShadow(newValue, e) {
    var shadow = _reactDom2.default.findDOMNode(this.refs.shadow);

    if (newValue !== undefined) {
      shadow.value = newValue;
    }

    var newHeight = shadow.scrollHeight;

    if (this.props.rowsMax >= this.props.rows) {
      newHeight = Math.min(this.props.rowsMax * rowsHeight, newHeight);
    }

    newHeight = Math.max(newHeight, rowsHeight);

    if (this.state.height !== newHeight) {
      this.setState({
        height: newHeight
      });

      if (this.props.onHeightChange) {
        this.props.onHeightChange(e, newHeight);
      }
    }
  },
  _handleChange: function _handleChange(e) {
    this._syncHeightWithShadow(e.target.value);

    if (this.props.hasOwnProperty('valueLink')) {
      this.props.valueLink.requestChange(e.target.value);
    }

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  },
  render: function render() {
    var _props = this.props;
    var onChange = _props.onChange;
    var onHeightChange = _props.onHeightChange;
    var rows = _props.rows;
    var style = _props.style;
    var textareaStyle = _props.textareaStyle;
    var valueLink = _props.valueLink;

    var other = _objectWithoutProperties(_props, ['onChange', 'onHeightChange', 'rows', 'style', 'textareaStyle', 'valueLink']);

    var textareaStyles = this.mergeStyles(styles.textarea, textareaStyle, {
      height: this.state.height
    });

    var shadowStyles = styles.shadow;

    if (this.props.hasOwnProperty('valueLink')) {
      other.value = this.props.valueLink.value;
    }

    if (this.props.disabled) {
      style.cursor = 'default';
    }

    return _react2.default.createElement(
      'div',
      { style: this.prepareStyles(this.props.style) },
      _react2.default.createElement('textarea', {
        ref: 'shadow',
        style: this.prepareStyles(shadowStyles),
        tabIndex: '-1',
        rows: this.props.rows,
        defaultValue: this.props.defaultValue,
        readOnly: true,
        value: this.props.value,
        valueLink: this.props.valueLink
      }),
      _react2.default.createElement('textarea', _extends({}, other, {
        ref: 'input',
        rows: this.props.rows,
        style: this.prepareStyles(textareaStyles),
        onChange: this._handleChange
      }))
    );
  }
});

exports.default = EnhancedTextarea;
module.exports = exports['default'];