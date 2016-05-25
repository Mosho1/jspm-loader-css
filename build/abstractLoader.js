'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* eslint-env node, browser */


var _cssModulesLoaderCore = require('css-modules-loader-core');

var _cssModulesLoaderCore2 = _interopRequireDefault(_cssModulesLoaderCore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CSSModuleLoaderProcess = function () {
  function CSSModuleLoaderProcess(plugins) {
    _classCallCheck(this, CSSModuleLoaderProcess);

    this._cssModulesLoader = new _cssModulesLoaderCore2.default(plugins);

    // enforce this on exported functions
    this.fetch = this.fetch.bind(this);
  }

  _createClass(CSSModuleLoaderProcess, [{
    key: 'fetch',
    value: function fetch(load, systemFetch) {
      var _this = this;

      var sourcePath = load.address.replace(System.baseURL, '');

      return systemFetch(load).then(function (source) {
        return _this._cssModulesLoader.load(source, sourcePath, '', _this._fetchDependencies.bind(_this));
      }).then(function (_ref) {
        var injectableSource = _ref.injectableSource;
        var exportTokens = _ref.exportTokens;

        var exportedTokens = void 0;
        var exportTokensString = JSON.stringify(exportTokens).replace(/"/g, '\\"');
        if (!System.production && typeof window !== 'undefined' && window.Proxy) {
          // During development, if supported, use a Proxy to detect missing CSS declarations.
          // Note the wrapping `'s - this is code exported as a string and executed later.
          exportedTokens = '\n            const styles = JSON.parse(\'' + exportTokensString + '\');\n            const propertyWhitelist = [\'__esModule\', \'then\', \'default\', \'trim\'];\n            const proxy = new Proxy(styles, {\n              get: function(target, name) {\n                if(!target.hasOwnProperty(name) && !propertyWhitelist.includes(name)) {\n                  console.warn(\'Styles lookup at key: \' + name + \' found no CSS.\');\n                }\n              \n                return target[name];\n              }\n            });\n          \n            module.exports = proxy;\n        ';
        } else {
          exportedTokens = 'module.exports = ' + exportTokensString + ';';
        }

        return {
          name: sourcePath,
          exportedTokens: exportedTokens,
          injectableSource: injectableSource
        };
      });
    }

    // Figure out the path that System will need to find the right file,
    // and trigger the import (which will instantiate this loader once more)

  }, {
    key: '_fetchDependencies',
    value: function _fetchDependencies(rawDependencyPath, relativeToPath) {
      var formattedDependencyPath = this._removeWrappingQuotes(rawDependencyPath);
      var canonicalParent = relativeToPath.replace(/^(C:)?\//, '');

      return System.normalize(formattedDependencyPath, '' + System.baseURL + canonicalParent).then(System.import.bind(System)).then(function (exportedTokens) {
        return exportedTokens.default || exportedTokens;
      });
    }
  }, {
    key: '_removeWrappingQuotes',
    value: function _removeWrappingQuotes(string) {
      return string.replace(/^["']|["']$/g, '');
    }
  }]);

  return CSSModuleLoaderProcess;
}();

exports.default = CSSModuleLoaderProcess;
