'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _recursiveReaddirSync = require('recursive-readdir-sync');

var _recursiveReaddirSync2 = _interopRequireDefault(_recursiveReaddirSync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var outArray = [];

(0, _recursiveReaddirSync2.default)('./').forEach(function (file) {
  if (file !== 'index-generator.js' && file !== 'index.js') {
    var fileLines = _fs2.default.readFileSync(file, 'utf8').split('\n');
    var index = 0;
    var found = false;

    while (found === false && index < fileLines.length) {
      if (fileLines[index].indexOf('export default') > -1) {
        var moduleName = fileLines[index].split(' ')[2].replace(';', '').trim();
        var modulePath = file.substring(0, file.length - 4);

        outArray.push('import ' + moduleName + ' from \'./' + modulePath + '\';\nexport { ' + moduleName + ' };\n');

        found = true;
      } else {
        index++;
      }
    }
  }
});

_fs2.default.writeFileSync('index.js', outArray.join(''));