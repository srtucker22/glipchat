'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shallowEqual = require('../utils/shallow-equal');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function relevantContextKeysEqual(classObject, currentContext, nextContext) {

  //Get those keys from current object's context that we care
  //about and check whether those keys have changed or not
  if (classObject.getRelevantContextKeys) {
    var currentContextKeys = classObject.getRelevantContextKeys(currentContext);
    var nextContextKeys = classObject.getRelevantContextKeys(nextContext);

    if (!(0, _shallowEqual2.default)(currentContextKeys, nextContextKeys)) {
      return false;
    }
  }

  //Check if children context keys changed
  if (classObject.getChildrenClasses) {
    var childrenArray = classObject.getChildrenClasses();
    for (var i = 0; i < childrenArray.length; i++) {
      if (!relevantContextKeysEqual(childrenArray[i], currentContext, nextContext)) {
        return false;
      }
    }
  }

  //context keys are equal
  return true;
}

exports.default = {

  //Don't update if state, prop, and context are equal

  shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState, nextContext) {

    //If either the props or state have changed, component should update
    if (!(0, _shallowEqual2.default)(this.props, nextProps) || !(0, _shallowEqual2.default)(this.state, nextState)) {
      return true;
    }

    //If current theme and next theme are both undefined, do not update
    if (!this.context.muiTheme && !nextContext.muiTheme) {
      return false;
    }

    //If both themes exist, compare keys only if current theme is not static
    if (this.context.muiTheme && nextContext.muiTheme) {
      return !this.context.muiTheme.static && !relevantContextKeysEqual(this.constructor, this.context.muiTheme, nextContext.muiTheme);
    }

    //At this point it is guaranteed that exactly one theme is undefined so simply update
    return true;
  }
};
module.exports = exports['default'];