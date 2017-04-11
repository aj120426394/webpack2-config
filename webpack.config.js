const webpackConfig = require('./main');
const path = require('path');

const base = new webpackConfig.Base({
  context: path.join(__dirname, 'app'),
  entry: {
    app: ['./js/index.js']
  },
  outputPath: path.join(__dirname, 'dist') ,
  publicPath: 'http://localhost:8100/',
  alias: {
    materialize: path.resolve(__dirname, 'app/vendors/materialize/js/bin/materialize.js'),
    hammerjs: path.resolve(__dirname, 'app/vendors/materialize/js/hammer.min.js')
  },
  devServerPort: 8100,
  htmlPath: './index.html'
});

base.addStyleConfig({
  extraResources: [
    path.resolve(__dirname, "node_modules/compass-mixins/lib"),
    path.resolve(__dirname, "app/vendors/materialize/sass")
  ],
  prefixWrap: '.fuck-black-board .super-important .this-is-damn-important',
  fastLoader: true
});

let config;
switch (process.env.npm_lifecycle_event) {
  case 'build:prod':
    config = base.buildForProduction(['jquery']);
    break;
  case 'build:dev':
    config = base.addConfig({
      config: webpackConfig.Util.clean(path.resolve(__dirname, 'dist'))
    });
    config = base.buildForDevelopment();
    break;
  default:
    config = base.buildForDevServer();
}
// console.log(config.module.rules[9]);
module.exports = config;
