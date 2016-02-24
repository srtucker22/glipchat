'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeStyles = mergeStyles;
exports.mergeAndPrefix = mergeAndPrefix;
exports.prepareStyles = prepareStyles;

var _autoPrefix = require('../styles/auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _reactAddonsUpdate = require('react-addons-update');

var _reactAddonsUpdate2 = _interopRequireDefault(_reactAddonsUpdate);

var _warning = require('warning');

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reTranslate = /((^|\s)translate(3d|X)?\()(\-?[\d]+)/;

var reSkew = /((^|\s)skew(x|y)?\()\s*(\-?[\d]+)(deg|rad|grad)(,\s*(\-?[\d]+)(deg|rad|grad))?/;

function mergeSingle(objA, objB) {
  if (!objA) return objB;
  if (!objB) return objA;
  return (0, _reactAddonsUpdate2.default)(objA, { $merge: objB });
}

/**
 * This function ensures that `style` supports both ltr and rtl directions by
 * checking `styleConstants` in `muiTheme` and replacing attribute keys if
 * necessary.
 */
function ensureDirection(muiTheme, style) {
  if (process.env.NODE_ENV !== 'production') {
    process.env.NODE_ENV !== "production" ? (0, _warning2.default)(!style.didFlip, 'You\'re calling ensureDirection() on the same style\n      object twice.') : undefined;

    style = mergeStyles({
      didFlip: 'true'
    }, style);
  }

  // Left to right is the default. No need to flip anything.
  if (!muiTheme || !muiTheme.isRtl) return style;

  var flippedAttributes = {
    // Keys and their replacements.
    right: 'left',
    left: 'right',
    marginRight: 'marginLeft',
    marginLeft: 'marginRight',
    paddingRight: 'paddingLeft',
    paddingLeft: 'paddingRight',
    borderRight: 'borderLeft',
    borderLeft: 'borderRight'
  };

  var newStyle = {};

  Object.keys(style).forEach(function (attribute) {
    var value = style[attribute];
    var key = attribute;

    if (flippedAttributes.hasOwnProperty(attribute)) {
      key = flippedAttributes[attribute];
    }

    switch (attribute) {
      case 'float':
      case 'textAlign':
        if (value === 'right') {
          value = 'left';
        } else if (value === 'left') {
          value = 'right';
        }
        break;

      case 'direction':
        if (value === 'ltr') {
          value = 'rtl';
        } else if (value === 'rtl') {
          value = 'ltr';
        }
        break;

      case 'transform':
        var matches = undefined;
        if (matches = value.match(reTranslate)) {
          value = value.replace(matches[0], matches[1] + -parseFloat(matches[4]));
        }
        if (matches = value.match(reSkew)) {
          value = value.replace(matches[0], matches[1] + -parseFloat(matches[4]) + matches[5] + matches[6] ? ',' + -parseFloat(matches[7]) + matches[8] : '');
        }
        break;

      case 'transformOrigin':
        if (value.indexOf('right') > -1) {
          value = value.replace('right', 'left');
        } else if (value.indexOf('left') > -1) {
          value = value.replace('left', 'right');
        }
        break;
    }

    newStyle[key] = value;
  });

  return newStyle;
}

function mergeStyles(base) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  for (var i = 0; i < args.length; i++) {
    if (args[i]) {
      base = mergeSingle(base, args[i]);
    }
  }
  return base;
}

/**
 * `mergeAndPrefix` is used to merge styles and autoprefix them. It has has been deprecated
 *  and should no longer be used.
 */
function mergeAndPrefix() {
  process.env.NODE_ENV !== "production" ? (0, _warning2.default)(false, 'Use of mergeAndPrefix() has been deprecated. ' + 'Please use mergeStyles() for merging styles, and then prepareStyles() for prefixing and ensuring direction.') : undefined;
  return _autoPrefix2.default.all(mergeStyles.apply(undefined, arguments));
}

/**
 * `prepareStyles` is used to merge multiple styles, make sure they are flipped
 * to rtl if needed, and then autoprefix them.
 *
 * Never call this on the same style object twice. As a rule of thumb, only
 * call it when passing style attribute to html elements.
 *
 * If this method detects you called it twice on the same style object, it
 * will produce a warning in the console.
 */
function prepareStyles(muiTheme) {
  var style = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  for (var _len2 = arguments.length, styles = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    styles[_key2 - 2] = arguments[_key2];
  }

  if (styles) {
    //warning(false, 'Providing more than one style argument to prepareStyles has been deprecated. ' +
    //  'Please pass a single style, such as the result from mergeStyles(...styles).');
    style = mergeStyles.apply(undefined, [style].concat(styles));
  }

  var flipped = ensureDirection(muiTheme, style);
  return muiTheme.prefix(flipped);
}

exports.default = {
  mergeStyles: mergeStyles,
  mergeAndPrefix: mergeAndPrefix,
  prepareStyles: prepareStyles
};