'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _paper = require('../paper');

var _paper2 = _interopRequireDefault(_paper);

var _stylePropable = require('../mixins/style-propable');

var _stylePropable2 = _interopRequireDefault(_stylePropable);

var _cardExpandable = require('./card-expandable');

var _cardExpandable2 = _interopRequireDefault(_cardExpandable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var Card = _react2.default.createClass({
  displayName: 'Card',

  propTypes: {
    /**
     * Whether a click on this card component expands the card. Can be set on any child of the Card component.
     */
    actAsExpander: _react2.default.PropTypes.bool,

    /**
     * Can be used to render elements inside the Card.
     */
    children: _react2.default.PropTypes.node,

    /**
     * Whether this card component is expandable. Can be set on any child of the Card component.
     */
    expandable: _react2.default.PropTypes.bool,

    /**
     * Whether this card is initially expanded.
     */
    initiallyExpanded: _react2.default.PropTypes.bool,

    /**
     * Fired when the expandable state changes.
     */
    onExpandChange: _react2.default.PropTypes.func,

    /**
     * Whether this card component include a button to expand the card. CardTitle,
     * CardHeader and CardActions implement showExpandableButton. Any child component
     * of Card can implements showExpandableButton or forwards the property to a child
     * component supporting it.
     */
    showExpandableButton: _react2.default.PropTypes.bool,

    /**
     * Override the inline-styles of the root element.
     */
    style: _react2.default.PropTypes.object
  },

  mixins: [_stylePropable2.default],

  getDefaultProps: function getDefaultProps() {
    return {
      expandable: false,
      initiallyExpanded: false,
      actAsExpander: false
    };
  },
  getInitialState: function getInitialState() {
    return {
      expanded: this.props.initiallyExpanded ? true : false
    };
  },
  _onExpandable: function _onExpandable(event) {
    event.preventDefault();
    var newExpandedState = !(this.state.expanded === true);
    this.setState({ expanded: newExpandedState });
    if (this.props.onExpandChange) this.props.onExpandChange(newExpandedState);
  },
  render: function render() {
    var _this = this;

    var lastElement = undefined;
    var newChildren = _react2.default.Children.map(this.props.children, function (currentChild) {
      var doClone = false;
      var newChild = undefined;
      var newProps = {};
      var element = currentChild;
      if (!currentChild || !currentChild.props) {
        return null;
      }
      if (_this.state.expanded === false && currentChild.props.expandable === true) return;
      if (currentChild.props.actAsExpander === true) {
        doClone = true;
        newProps.onTouchTap = _this._onExpandable;
        newProps.style = _this.mergeStyles({ cursor: 'pointer' }, currentChild.props.style);
      }
      if (currentChild.props.showExpandableButton === true) {
        doClone = true;
        newChild = _react2.default.createElement(_cardExpandable2.default, { expanded: _this.state.expanded, onExpanding: _this._onExpandable });
      }
      if (doClone) {
        element = _react2.default.cloneElement(currentChild, newProps, currentChild.props.children, newChild);
      }
      return element;
    }, this);

    // If the last element is text or a title we should add
    // 8px padding to the bottom of the card
    var addBottomPadding = lastElement && (lastElement.type.displayName === 'CardText' || lastElement.type.displayName === 'CardTitle');
    var _props = this.props;
    var style = _props.style;

    var other = _objectWithoutProperties(_props, ['style']);

    var mergedStyles = this.mergeStyles({
      overflow: 'hidden',
      zIndex: 1
    }, style);

    return _react2.default.createElement(
      _paper2.default,
      _extends({}, other, { style: mergedStyles }),
      _react2.default.createElement(
        'div',
        { style: { paddingBottom: addBottomPadding ? 8 : 0 } },
        newChildren
      )
    );
  }
});

exports.default = Card;
module.exports = exports['default'];