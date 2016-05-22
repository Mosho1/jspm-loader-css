import Plugins from './plugins.js';
import Loader from './loader.js';

const { fetch, bundle } = new Loader([
  Plugins.values,
  Plugins.localByDefault,
  Plugins.extractImports,
  Plugins.scope
]);

export { Loader, Plugins, fetch, bundle };