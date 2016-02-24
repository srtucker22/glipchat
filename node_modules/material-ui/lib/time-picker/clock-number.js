'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

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

var ClockNumber = _react2.default.createClass({
  displayName: 'ClockNumber',

  propTypes: {
    isSelected: _react2.default.PropTypes.bool,
    onSelected: _react2.default.PropTypes.func,
    type: _react2.default.PropTypes.oneOf(['hour', 'minute']),
    value: _react2.default.PropTypes.number
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
      value: 0,
      type: 'minute',
      isSelected: false
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
  getTheme: function getTheme() {
    return this.state.muiTheme.timePicker;
  },
  render: function render() {
    var pos = this.props.value;
    var inner = false;

    if (this.props.type === 'hour') {
      inner = pos < 1 || pos > 12;
      pos %= 12;
    } else {
      pos = pos / 5;
    }

    var positions = [[0, 5], [54.5, 16.6], [94.4, 59.5], [109, 114], [94.4, 168.5], [54.5, 208.4], [0, 223], [-54.5, 208.4], [-94.4, 168.5], [-109, 114], [-94.4, 59.5], [-54.5, 19.6]];

    var innerPositions = [[0, 40], [36.9, 49.9], [64, 77], [74, 114], [64, 151], [37, 178], [0, 188], [-37, 178], [-64, 151], [-74, 114], [-64, 77], [-37, 50]];

    var styles = {
      root: {
        display: 'inline-block',
        position: 'absolute',
        width: 32,
        height: 32,
        borderRadius: '100%',
        left: 'calc(50% - 16px)',
        top: 10,
        textAlign: 'center',
        paddingTop: 5,
        userSelect: 'none', /* Chrome all / Safari all */
        fontSize: '1.1em',
        pointerEvents: 'none',
        boxSizing: 'border-box'
      }
    };

    if (this.props.isSelected) {
      styles.root.backgroundColor = this.getTheme().accentColor;
      styles.root.color = this.getTheme().selectTextColor;
    }

    var transformPos = positions[pos];

    if (inner) {
      styles.root.width = 28;
      styles.root.height = 28;
      styles.root.left = 'calc(50% - 14px)';
      transformPos = innerPositions[pos];
    }

    var _transformPos = transformPos;

    var _transformPos2 = _slicedToArray(_transformPos, 2);

    var x = _transformPos2[0];
    var y = _transformPos2[1];

    styles.root.transform = 'translate(' + x + 'px, ' + y + 'px)';

    return _react2.default.createElement(
      'span',
      { style: this.prepareStyles(styles.root) },
      this.props.value
    );
  }
});

exports.default = ClockNumber;
module.exports = exports['default'];