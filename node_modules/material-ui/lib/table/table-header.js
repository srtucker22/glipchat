'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _tableHeaderColumn = require('./table-header-column');

var _tableHeaderColumn2 = _interopRequireDefault(_tableHeaderColumn);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var TableHeader = _react2.default.createClass({
  displayName: 'TableHeader',

  propTypes: {
    /**
     * Controls whether or not header rows should be
     * adjusted for a checkbox column. If the select all
     * checkbox is true, this property will not influence
     * the number of columns. This is mainly useful for
     * "super header" rows so that the checkbox column
     * does not create an offset that needs to be accounted
     * for manually.
     */
    adjustForCheckbox: _react2.default.PropTypes.bool,

    /**
     * Children passed to table header.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Controls whether or not the select all checkbox is displayed.
     */
    displaySelectAll: _react2.default.PropTypes.bool,

    /**
     * If set to true, the select all button will be interactable.
     * If set to false, the button will not be interactable.
     * To hide the checkbox, set displaySelectAll to false.
     */
    enableSelectAll: _react2.default.PropTypes.bool,

    /**
     * Callback when select all has been checked.
     */
    onSelectAll: _react2.default.PropTypes.func,

    /**
     * True when select all has been checked.
     */
    selectAllSelected: _react2.default.PropTypes.bool,

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
      adjustForCheckbox: true,
      displaySelectAll: true,
      enableSelectAll: true,
      selectAllSelected: false
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
    return this.state.muiTheme.tableHeader;
  },
  getStyles: function getStyles() {
    var styles = {
      root: {
        borderBottom: '1px solid ' + this.getTheme().borderColor
      }
    };

    return styles;
  },
  _createSuperHeaderRows: function _createSuperHeaderRows() {
    var numChildren = _react2.default.Children.count(this.props.children);
    if (numChildren === 1) return undefined;

    var superHeaders = [];
    for (var index = 0; index < numChildren - 1; index++) {
      var child = this.props.children[index];

      if (!_react2.default.isValidElement(child)) continue;

      var props = {
        key: 'sh' + index,
        rowNumber: index
      };
      superHeaders.push(this._createSuperHeaderRow(child, props));
    }

    if (superHeaders.length) return superHeaders;
  },
  _createSuperHeaderRow: function _createSuperHeaderRow(child, props) {
    var children = [];
    if (this.props.adjustForCheckbox) {
      children.push(this._getCheckboxPlaceholder(props));
    }
    _react2.default.Children.forEach(child.props.children, function (child) {
      children.push(child);
    });

    return _react2.default.cloneElement(child, props, children);
  },
  _createBaseHeaderRow: function _createBaseHeaderRow() {
    var numChildren = _react2.default.Children.count(this.props.children);
    var child = numChildren === 1 ? this.props.children : this.props.children[numChildren - 1];
    var props = {
      key: 'h' + numChildren,
      rowNumber: numChildren
    };

    var children = [this._getSelectAllCheckboxColumn(props)];
    _react2.default.Children.forEach(child.props.children, function (child) {
      children.push(child);
    });

    return _react2.default.cloneElement(child, props, children);
  },
  _getCheckboxPlaceholder: function _getCheckboxPlaceholder(props) {
    if (!this.props.adjustForCheckbox) return null;

    var key = 'hpcb' + props.rowNumber;
    return _react2.default.createElement(_tableHeaderColumn2.default, { key: key, style: { width: 24 } });
  },
  _getSelectAllCheckboxColumn: function _getSelectAllCheckboxColumn(props) {
    if (!this.props.displaySelectAll) return this._getCheckboxPlaceholder(props);

    var checkbox = _react2.default.createElement(_checkbox2.default, {
      key: 'selectallcb',
      name: 'selectallcb',
      value: 'selected',
      disabled: !this.props.enableSelectAll,
      checked: this.props.selectAllSelected,
      onCheck: this._onSelectAll
    });

    var key = 'hpcb' + props.rowNumber;
    return _react2.default.createElement(
      _tableHeaderColumn2.default,
      { key: key, style: { width: 24 } },
      checkbox
    );
  },
  _onSelectAll: function _onSelectAll(e, checked) {
    if (this.props.onSelectAll) this.props.onSelectAll(checked);
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['className', 'style']);

    var superHeaderRows = this._createSuperHeaderRows();
    var baseHeaderRow = this._createBaseHeaderRow();

    return _react2.default.createElement(
      'thead',
      { className: className, style: this.prepareStyles(this.getStyles().root, style) },
      superHeaderRows,
      baseHeaderRow
    );
  }
});

exports.default = TableHeader;
module.exports = exports['default'];