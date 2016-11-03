/* */ 
'use strict';
Object.defineProperty(exports, "__esModule", {value: true});
exports.bundle = exports.fetch = exports.Plugins = exports.Loader = undefined;
var _plugins = require('./plugins');
var _plugins2 = _interopRequireDefault(_plugins);
var _loader = require('./loader');
var _loader2 = _interopRequireDefault(_loader);
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {default: obj};
}
var _ref = new _loader2.default([_plugins2.default.values, _plugins2.default.localByDefault, _plugins2.default.extractImports, _plugins2.default.scope]);
var fetch = _ref.fetch;
var bundle = _ref.bundle;
exports.Loader = _loader2.default;
exports.Plugins = _plugins2.default;
exports.fetch = fetch;
exports.bundle = bundle;
