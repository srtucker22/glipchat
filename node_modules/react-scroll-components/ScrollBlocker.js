/** @jsx React.DOM */
var React = require('react');
var assign = require('react/lib/Object.assign');

var blockerStyle = {
  pointerEvents: 'none'
};

var ScrollBlocker = React.createClass({displayName: "ScrollBlocker",

  propTypes: {
    active: React.PropTypes.bool,
    style: React.PropTypes.object,
    children: React.PropTypes.node
  },

  getDefaultProps: function () {
    return {
      active: false
    };
  },

  render: function () {
    var $__0=      this.props,style=$__0.style,active=$__0.active,other=(function(source, exclusion) {var rest = {};var hasOwn = Object.prototype.hasOwnProperty;if (source == null) {throw new TypeError();}for (var key in source) {if (hasOwn.call(source, key) && !hasOwn.call(exclusion, key)) {rest[key] = source[key];}}return rest;})($__0,{style:1,active:1});

    return (
      React.createElement("div", React.__spread({},  other, {style: assign({}, style, active && blockerStyle)}), 
        this.props.children
      )
    );
  }
});

module.exports = ScrollBlocker;