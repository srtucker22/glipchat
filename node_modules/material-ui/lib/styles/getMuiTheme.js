'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getMuiTheme;

var _lodash = require('lodash.merge');

var _lodash2 = _interopRequireDefault(_lodash);

var _colors = require('./colors');

var _colors2 = _interopRequireDefault(_colors);

var _colorManipulator = require('../utils/color-manipulator');

var _colorManipulator2 = _interopRequireDefault(_colorManipulator);

var _autoPrefix = require('./auto-prefix');

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _lightBaseTheme = require('./baseThemes/lightBaseTheme');

var _lightBaseTheme2 = _interopRequireDefault(_lightBaseTheme);

var _zIndex = require('./zIndex');

var _zIndex2 = _interopRequireDefault(_zIndex);

var _transformers = require('./transformers');

var _lodash3 = require('lodash.flowright');

var _lodash4 = _interopRequireDefault(_lodash3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/**
 * Get the MUI theme corresponding to a base theme.
 * It's possible to override the computed theme values
 * by providing a second argument. The calculated
 * theme will be deeply merged with the second argument.
 */
function getMuiTheme(baseTheme, muiTheme) {
  baseTheme = (0, _lodash2.default)({}, _lightBaseTheme2.default, baseTheme);
  var _baseTheme = baseTheme;
  var palette = _baseTheme.palette;
  var spacing = _baseTheme.spacing;

  muiTheme = (0, _lodash2.default)({
    isRtl: false,
    userAgent: undefined,
    zIndex: _zIndex2.default,
    baseTheme: baseTheme,
    rawTheme: baseTheme, // To provide backward compatibility.
    appBar: {
      color: palette.primary1Color,
      textColor: palette.alternateTextColor,
      height: spacing.desktopKeylineIncrement
    },
    avatar: {
      borderColor: 'rgba(0, 0, 0, 0.08)'
    },
    badge: {
      color: palette.alternateTextColor,
      textColor: palette.textColor,
      primaryColor: palette.accent1Color,
      primaryTextColor: palette.alternateTextColor,
      secondaryColor: palette.primary1Color,
      secondaryTextColor: palette.alternateTextColor
    },
    button: {
      height: 36,
      minWidth: 88,
      iconButtonSize: spacing.iconSize * 2
    },
    cardText: {
      textColor: palette.textColor
    },
    checkbox: {
      boxColor: palette.textColor,
      checkedColor: palette.primary1Color,
      requiredColor: palette.primary1Color,
      disabledColor: palette.disabledColor,
      labelColor: palette.textColor,
      labelDisabledColor: palette.disabledColor
    },
    datePicker: {
      color: palette.primary1Color,
      textColor: palette.alternateTextColor,
      calendarTextColor: palette.textColor,
      selectColor: palette.primary2Color,
      selectTextColor: palette.alternateTextColor
    },
    dropDownMenu: {
      accentColor: palette.borderColor
    },
    flatButton: {
      color: _colors2.default.transparent,
      buttonFilterColor: '#999999',
      disabledTextColor: _colorManipulator2.default.fade(palette.textColor, 0.3),
      textColor: palette.textColor,
      primaryTextColor: palette.accent1Color,
      secondaryTextColor: palette.primary1Color
    },
    floatingActionButton: {
      buttonSize: 56,
      miniSize: 40,
      color: palette.accent1Color,
      iconColor: palette.alternateTextColor,
      secondaryColor: palette.primary1Color,
      secondaryIconColor: palette.alternateTextColor,
      disabledTextColor: palette.disabledColor
    },
    gridTile: {
      textColor: _colors2.default.white
    },
    inkBar: {
      backgroundColor: palette.accent1Color
    },
    leftNav: {
      width: spacing.desktopKeylineIncrement * 4,
      color: palette.canvasColor
    },
    listItem: {
      nestedLevelDepth: 18
    },
    menu: {
      backgroundColor: palette.canvasColor,
      containerBackgroundColor: palette.canvasColor
    },
    menuItem: {
      dataHeight: 32,
      height: 48,
      hoverColor: 'rgba(0, 0, 0, .035)',
      padding: spacing.desktopGutter,
      selectedTextColor: palette.accent1Color
    },
    menuSubheader: {
      padding: spacing.desktopGutter,
      borderColor: palette.borderColor,
      textColor: palette.primary1Color
    },
    paper: {
      backgroundColor: palette.canvasColor,
      zDepthShadows: [[1, 6, 0.12, 1, 4, 0.12], [3, 10, 0.16, 3, 10, 0.23], [10, 30, 0.19, 6, 10, 0.23], [14, 45, 0.25, 10, 18, 0.22], [19, 60, 0.30, 15, 20, 0.22]].map(function (d) {
        return '0 ' + d[0] + 'px ' + d[1] + 'px ' + _colorManipulator2.default.fade(palette.shadowColor, d[2]) + ',\n         0 ' + d[3] + 'px ' + d[4] + 'px ' + _colorManipulator2.default.fade(palette.shadowColor, d[5]);
      })
    },
    radioButton: {
      borderColor: palette.textColor,
      backgroundColor: palette.alternateTextColor,
      checkedColor: palette.primary1Color,
      requiredColor: palette.primary1Color,
      disabledColor: palette.disabledColor,
      size: 24,
      labelColor: palette.textColor,
      labelDisabledColor: palette.disabledColor
    },
    raisedButton: {
      color: palette.alternateTextColor,
      textColor: palette.textColor,
      primaryColor: palette.accent1Color,
      primaryTextColor: palette.alternateTextColor,
      secondaryColor: palette.primary1Color,
      secondaryTextColor: palette.alternateTextColor,
      disabledColor: _colorManipulator2.default.darken(palette.alternateTextColor, 0.1),
      disabledTextColor: _colorManipulator2.default.fade(palette.textColor, 0.3)
    },
    refreshIndicator: {
      strokeColor: palette.borderColor,
      loadingStrokeColor: palette.primary1Color
    },
    slider: {
      trackSize: 2,
      trackColor: palette.primary3Color,
      trackColorSelected: palette.accent3Color,
      handleSize: 12,
      handleSizeDisabled: 8,
      handleSizeActive: 18,
      handleColorZero: palette.primary3Color,
      handleFillColor: palette.alternateTextColor,
      selectionColor: palette.primary1Color,
      rippleColor: palette.primary1Color
    },
    snackbar: {
      textColor: palette.alternateTextColor,
      backgroundColor: palette.textColor,
      actionColor: palette.accent1Color
    },
    table: {
      backgroundColor: palette.canvasColor
    },
    tableHeader: {
      borderColor: palette.borderColor
    },
    tableHeaderColumn: {
      textColor: palette.accent3Color,
      height: 56,
      spacing: 24
    },
    tableFooter: {
      borderColor: palette.borderColor,
      textColor: palette.accent3Color
    },
    tableRow: {
      hoverColor: palette.accent2Color,
      stripeColor: _colorManipulator2.default.lighten(palette.primary1Color, 0.55),
      selectedColor: palette.borderColor,
      textColor: palette.textColor,
      borderColor: palette.borderColor,
      height: 48
    },
    tableRowColumn: {
      height: 48,
      spacing: 24
    },
    timePicker: {
      color: palette.alternateTextColor,
      textColor: palette.accent3Color,
      accentColor: palette.primary1Color,
      clockColor: palette.textColor,
      clockCircleColor: palette.clockCircleColor,
      headerColor: palette.pickerHeaderColor || palette.primary1Color,
      selectColor: palette.primary2Color,
      selectTextColor: palette.alternateTextColor
    },
    toggle: {
      thumbOnColor: palette.primary1Color,
      thumbOffColor: palette.accent2Color,
      thumbDisabledColor: palette.borderColor,
      thumbRequiredColor: palette.primary1Color,
      trackOnColor: _colorManipulator2.default.fade(palette.primary1Color, 0.5),
      trackOffColor: palette.primary3Color,
      trackDisabledColor: palette.primary3Color,
      labelColor: palette.textColor,
      labelDisabledColor: palette.disabledColor,
      trackRequiredColor: _colorManipulator2.default.fade(palette.primary1Color, 0.5)
    },
    toolbar: {
      backgroundColor: _colorManipulator2.default.darken(palette.accent2Color, 0.05),
      height: 56,
      titleFontSize: 20,
      iconColor: 'rgba(0, 0, 0, .40)',
      separatorColor: 'rgba(0, 0, 0, .175)',
      menuHoverColor: 'rgba(0, 0, 0, .10)'
    },
    tabs: {
      backgroundColor: palette.primary1Color,
      textColor: _colorManipulator2.default.fade(palette.alternateTextColor, 0.7),
      selectedTextColor: palette.alternateTextColor
    },
    textField: {
      textColor: palette.textColor,
      hintColor: palette.disabledColor,
      floatingLabelColor: palette.textColor,
      disabledTextColor: palette.disabledColor,
      errorColor: _colors2.default.red500,
      focusColor: palette.primary1Color,
      backgroundColor: 'transparent',
      borderColor: palette.borderColor
    }
  }, muiTheme);

  var transformers = [_transformers.autoprefixer, _transformers.rtl, _transformers.callOnce].map(function (t) {
    return t(muiTheme);
  }).filter(function (t) {
    return t;
  });
  muiTheme.prefix = _autoPrefix2.default.getTransform(muiTheme.userAgent);
  muiTheme.prepareStyles = _lodash4.default.apply(undefined, _toConsumableArray(transformers));

  return muiTheme;
}
module.exports = exports['default'];