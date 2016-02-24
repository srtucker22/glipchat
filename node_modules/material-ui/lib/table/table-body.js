'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _checkbox = require('../checkbox');

var _checkbox2 = _interopRequireDefault(_checkbox);

var _tableRowColumn = require('./table-row-column');

var _tableRowColumn2 = _interopRequireDefault(_tableRowColumn);

var _clickAwayable = require('../mixins/click-awayable');

var _clickAwayable2 = _interopRequireDefault(_clickAwayable);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _getMuiTheme = require('../styles/getMuiTheme');

var _getMuiTheme2 = _interopRequireDefault(_getMuiTheme);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TableBody = _react2.default.createClass({
  displayName: 'TableBody',

  propTypes: {
    /**
     * Set to true to indicate that all rows should be selected.
     */
    allRowsSelected: _react2.default.PropTypes.bool,

    /**
     * Children passed to table body.
     */
    children: _react2.default.PropTypes.node,

    /**
     * The css class name of the root element.
     */
    className: _react2.default.PropTypes.string,

    /**
     * Controls whether or not to deselect all selected
     * rows after clicking outside the table.
     */
    deselectOnClickaway: _react2.default.PropTypes.bool,

    /**
     * Controls the display of the row checkbox. The default value is true.
     */
    displayRowCheckbox: _react2.default.PropTypes.bool,

    /**
     * If true, multiple table rows can be selected.
     * CTRL/CMD+Click and SHIFT+Click are valid actions.
     * The default value is false.
     */
    multiSelectable: _react2.default.PropTypes.bool,

    /**
     * Callback function for when a cell is clicked.
     */
    onCellClick: _react2.default.PropTypes.func,

    /**
     * Called when a table cell is hovered. rowNumber
     * is the row number of the hovered row and columnId
     * is the column number or the column key of the cell.
     */
    onCellHover: _react2.default.PropTypes.func,

    /**
     * Called when a table cell is no longer hovered.
     * rowNumber is the row number of the row and columnId
     * is the column number or the column key of the cell.
     */
    onCellHoverExit: _react2.default.PropTypes.func,

    /**
     * Called when a table row is hovered.
     * rowNumber is the row number of the hovered row.
     */
    onRowHover: _react2.default.PropTypes.func,

    /**
     * Called when a table row is no longer
     * hovered. rowNumber is the row number of the row
     * that is no longer hovered.
     */
    onRowHoverExit: _react2.default.PropTypes.func,

    /**
     * Called when a row is selected. selectedRows is an
     * array of all row selections. IF all rows have been selected,
     * the string "all" will be returned instead to indicate that
     * all rows have been selected.
     */
    onRowSelection: _react2.default.PropTypes.func,

    /**
     * Controls whether or not the rows are pre-scanned to determine
     * initial state. If your table has a large number of rows and
     * you are experiencing a delay in rendering, turn off this property.
     */
    preScanRows: _react2.default.PropTypes.bool,

    /**
     * If true, table rows can be selected. If multiple
     * row selection is desired, enable multiSelectable.
     * The default value is true.
     */
    selectable: _react2.default.PropTypes.bool,

    /**
     * If true, table rows will be highlighted when
     * the cursor is hovering over the row. The default
     * value is false.
     */
    showRowHover: _react2.default.PropTypes.bool,

    /**
     * If true, every other table row starting
     * with the first row will be striped. The default value is false.
     */
    stripedRows: _react2.default.PropTypes.bool,

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

  mixins: [_clickAwayable2.default, _stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      allRowsSelected: false,
      deselectOnClickaway: true,
      displayRowCheckbox: true,
      multiSelectable: false,
      preScanRows: true,
      selectable: true,
      style: {}
    };
  },
  getInitialState: function getInitialState() {
    return {
      muiTheme: this.context.muiTheme || (0, _getMuiTheme2.default)(),
      selectedRows: this._calculatePreselectedRows(this.props)
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

    var newState = {};

    if (this.props.allRowsSelected && !nextProps.allRowsSelected) {
      newState.selectedRows = this.state.selectedRows.length > 0 ? [this.state.selectedRows[this.state.selectedRows.length - 1]] : [];
    } else {
      newState.selectedRows = this._calculatePreselectedRows(nextProps);
    }

    this.setState(newState);
  },
  componentClickAway: function componentClickAway() {
    if (this.props.deselectOnClickaway && this.state.selectedRows.length) {
      this.setState({ selectedRows: [] });
      if (this.props.onRowSelection) this.props.onRowSelection([]);
    }
  },
  _createRows: function _createRows() {
    var _this = this;

    var numChildren = _react2.default.Children.count(this.props.children);
    var rowNumber = 0;
    var handlers = {
      onCellClick: this._onCellClick,
      onCellHover: this._onCellHover,
      onCellHoverExit: this._onCellHoverExit,
      onRowHover: this._onRowHover,
      onRowHoverExit: this._onRowHoverExit,
      onRowClick: this._onRowClick
    };

    return _react2.default.Children.map(this.props.children, function (child) {
      if (_react2.default.isValidElement(child)) {
        var _ret = function () {
          var props = {
            displayRowCheckbox: _this.props.displayRowCheckbox,
            hoverable: _this.props.showRowHover,
            selected: _this._isRowSelected(rowNumber),
            striped: _this.props.stripedRows && rowNumber % 2 === 0,
            rowNumber: rowNumber++
          };
          var checkboxColumn = _this._createRowCheckboxColumn(props);

          if (rowNumber === numChildren) {
            props.displayBorder = false;
          }

          var children = [checkboxColumn];
          _react2.default.Children.forEach(child.props.children, function (child) {
            children.push(child);
          });

          return {
            v: _react2.default.cloneElement(child, _extends({}, props, handlers), children)
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    });
  },
  _createRowCheckboxColumn: function _createRowCheckboxColumn(rowProps) {
    if (!this.props.displayRowCheckbox) return null;

    var key = rowProps.rowNumber + '-cb';
    var checkbox = _react2.default.createElement(_checkbox2.default, {
      ref: 'rowSelectCB',
      name: key,
      value: 'selected',
      disabled: !this.props.selectable,
      checked: rowProps.selected
    });

    return _react2.default.createElement(
      _tableRowColumn2.default,
      {
        key: key,
        columnNumber: 0,
        style: { width: 24 }
      },
      checkbox
    );
  },
  _calculatePreselectedRows: function _calculatePreselectedRows(props) {
    // Determine what rows are 'pre-selected'.
    var preSelectedRows = [];

    if (props.selectable && props.preScanRows) {
      (function () {
        var index = 0;
        _react2.default.Children.forEach(props.children, function (child) {
          if (_react2.default.isValidElement(child)) {
            if (child.props.selected && (preSelectedRows.length === 0 || props.multiSelectable)) {
              preSelectedRows.push(index);
            }

            index++;
          }
        });
      })();
    }

    return preSelectedRows;
  },
  _isRowSelected: function _isRowSelected(rowNumber) {
    if (this.props.allRowsSelected) {
      return true;
    }

    for (var i = 0; i < this.state.selectedRows.length; i++) {
      var selection = this.state.selectedRows[i];

      if ((typeof selection === 'undefined' ? 'undefined' : _typeof(selection)) === 'object') {
        if (this._isValueInRange(rowNumber, selection)) return true;
      } else {
        if (selection === rowNumber) return true;
      }
    }

    return false;
  },
  _isValueInRange: function _isValueInRange(value, range) {
    if (!range) return false;

    if (range.start <= value && value <= range.end || range.end <= value && value <= range.start) {
      return true;
    }

    return false;
  },
  _onRowClick: function _onRowClick(e, rowNumber) {
    e.stopPropagation();

    if (this.props.selectable) {
      // Prevent text selection while selecting rows.
      window.getSelection().removeAllRanges();
      this._processRowSelection(e, rowNumber);
    }
  },
  _processRowSelection: function _processRowSelection(e, rowNumber) {
    var selectedRows = this.state.selectedRows;

    if (e.shiftKey && this.props.multiSelectable && selectedRows.length) {
      var lastIndex = selectedRows.length - 1;
      var lastSelection = selectedRows[lastIndex];

      if ((typeof lastSelection === 'undefined' ? 'undefined' : _typeof(lastSelection)) === 'object') {
        lastSelection.end = rowNumber;
      } else {
        selectedRows.splice(lastIndex, 1, { start: lastSelection, end: rowNumber });
      }
    } else if ((e.ctrlKey && !e.metaKey || e.metaKey && !e.ctrlKey) && this.props.multiSelectable) {
      var idx = selectedRows.indexOf(rowNumber);
      if (idx < 0) {
        var foundRange = false;
        for (var i = 0; i < selectedRows.length; i++) {
          var range = selectedRows[i];
          if ((typeof range === 'undefined' ? 'undefined' : _typeof(range)) !== 'object') continue;

          if (this._isValueInRange(rowNumber, range)) {
            var _selectedRows;

            foundRange = true;
            var values = this._splitRange(range, rowNumber);
            (_selectedRows = selectedRows).splice.apply(_selectedRows, [i, 1].concat(_toConsumableArray(values)));
          }
        }

        if (!foundRange) selectedRows.push(rowNumber);
      } else {
        selectedRows.splice(idx, 1);
      }
    } else {
      if (selectedRows.length === 1 && selectedRows[0] === rowNumber) {
        selectedRows = [];
      } else {
        selectedRows = [rowNumber];
      }
    }

    this.setState({ selectedRows: selectedRows });
    if (this.props.onRowSelection) this.props.onRowSelection(this._flattenRanges(selectedRows));
  },
  _splitRange: function _splitRange(range, splitPoint) {
    var splitValues = [];
    var startOffset = range.start - splitPoint;
    var endOffset = range.end - splitPoint;

    // Process start half
    splitValues.push.apply(splitValues, _toConsumableArray(this._genRangeOfValues(splitPoint, startOffset)));

    // Process end half
    splitValues.push.apply(splitValues, _toConsumableArray(this._genRangeOfValues(splitPoint, endOffset)));

    return splitValues;
  },
  _genRangeOfValues: function _genRangeOfValues(start, offset) {
    var values = [];
    var dir = offset > 0 ? -1 : 1; // This forces offset to approach 0 from either direction.
    while (offset !== 0) {
      values.push(start + offset);
      offset += dir;
    }

    return values;
  },
  _flattenRanges: function _flattenRanges(selectedRows) {
    var rows = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = selectedRows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var selection = _step.value;

        if ((typeof selection === 'undefined' ? 'undefined' : _typeof(selection)) === 'object') {
          var values = this._genRangeOfValues(selection.end, selection.start - selection.end);
          rows.push.apply(rows, [selection.end].concat(_toConsumableArray(values)));
        } else {
          rows.push(selection);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return rows.sort();
  },
  _onCellClick: function _onCellClick(e, rowNumber, columnNumber) {
    e.stopPropagation();
    if (this.props.onCellClick) this.props.onCellClick(rowNumber, this._getColumnId(columnNumber));
  },
  _onCellHover: function _onCellHover(e, rowNumber, columnNumber) {
    if (this.props.onCellHover) this.props.onCellHover(rowNumber, this._getColumnId(columnNumber));
    this._onRowHover(e, rowNumber);
  },
  _onCellHoverExit: function _onCellHoverExit(e, rowNumber, columnNumber) {
    if (this.props.onCellHoverExit) this.props.onCellHoverExit(rowNumber, this._getColumnId(columnNumber));
    this._onRowHoverExit(e, rowNumber);
  },
  _onRowHover: function _onRowHover(e, rowNumber) {
    if (this.props.onRowHover) this.props.onRowHover(rowNumber);
  },
  _onRowHoverExit: function _onRowHoverExit(e, rowNumber) {
    if (this.props.onRowHoverExit) this.props.onRowHoverExit(rowNumber);
  },
  _getColumnId: function _getColumnId(columnNumber) {
    var columnId = columnNumber;
    if (this.props.displayRowCheckbox) columnId--;

    return columnId;
  },
  render: function render() {
    var _props = this.props;
    var className = _props.className;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['className', 'style']);

    var rows = this._createRows();

    return _react2.default.createElement(
      'tbody',
      { className: className, style: this.prepareStyles(style) },
      rows
    );
  }
});

exports.default = TableBody;
module.exports = exports['default'];