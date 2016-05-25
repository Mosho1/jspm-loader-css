'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _abstractLoader = require('./abstractLoader.js');

var _abstractLoader2 = _interopRequireDefault(_abstractLoader);

var _cssnano = require('cssnano');

var _cssnano2 = _interopRequireDefault(_cssnano);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-env node */


// Append a <style> tag to the page and fill it with inline CSS styles.
var cssInjectFunction = '(function(c){\n  var d=document,a="appendChild",i="styleSheet",s=d.createElement("style");\n  d.head[a](s);\n  s[i]?s[i].cssText=c:s[a](d.createTextNode(c));\n})';

// Escape any whitespace characters before outputting as string so that data integrity can be preserved.
var escape = function escape(source) {
  return source.replace(/(["\\])/g, '\\$1').replace(/[\f]/g, '\\f').replace(/[\b]/g, '\\b').replace(/[\n]/g, '\\n').replace(/[\t]/g, '\\t').replace(/[\r]/g, '\\r').replace(/[\']/g, '\\\'').replace(/[\u2028]/g, '\\u2028').replace(/[\u2029]/g, '\\u2029');
};

var emptySystemRegister = function emptySystemRegister(system, name) {
  return system + '.register(\'' + name + '\', [], function() { return { setters: [], execute: function() {}}});';
};

var NodeLoader = function (_AbstractLoader) {
  _inherits(NodeLoader, _AbstractLoader);

  function NodeLoader(plugins) {
    _classCallCheck(this, NodeLoader);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(NodeLoader).call(this, plugins));

    _this._injectableSources = [];

    _this.fetch = _this.fetch.bind(_this);
    _this.bundle = _this.bundle.bind(_this);
    return _this;
  }

  _createClass(NodeLoader, [{
    key: 'fetch',
    value: function fetch(load, systemFetch) {
      var _this2 = this;

      return _get(Object.getPrototypeOf(NodeLoader.prototype), 'fetch', this).call(this, load, systemFetch).then(function (styleSheet) {
        _this2._injectableSources.push(styleSheet.injectableSource);
        return styleSheet;
      })
      // Return the export tokens to the js files
      .then(function (styleSheet) {
        return styleSheet.exportedTokens;
      });
    }
  }, {
    key: 'bundle',
    value: function bundle(loads, compileOpts, outputOpts) {
      /*eslint-disable no-console */
      if (outputOpts.buildCSS === false) {
        console.warn('Opting out of buildCSS not yet supported.');
      }

      if (outputOpts.separateCSS === true) {
        console.warn('Separting CSS not yet supported.');
      }

      if (outputOpts.sourceMaps === true) {
        console.warn('Source Maps not yet supported');
      }
      /*eslint-enable  no-console */

        // Take all of the CSS files which need to be output and generate a fake System registration for them.
        // This will make System believe all files exist as needed.
        // Then, take the combined output of all the CSS files and generate a single <style> tag holding all the info.
        var fileDefinitions = loads.map(function (load) {
          return emptySystemRegister(compileOpts.systemGlobal || 'System', load.name);
        }).join('\n');

        return Promise.resolve('' + fileDefinitions + cssInjectFunction + '(\'' + escape(this._injectableSources.join('\n')) + '\');');
      
    }
  }]);

  return NodeLoader;
}(_abstractLoader2.default);

exports.default = NodeLoader;
