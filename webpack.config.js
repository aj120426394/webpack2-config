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


const cssConfig = {
  filter: 'exclude',
  path: [],
  extraResources: []
};

base.addStyleConfig(cssConfig);
//
// base.addConfig({
//   config: {
//     module: {
//       rules: [
//         {
//           test: /\.(scss|sass)$/,
//           use: [
//             'css-loader',
//             'fast-sass-loader'
//           ]
//         },
//         // other loaders ...
//       ]
//     }
//   }
// });

//
// const vendorCSSConfig = {
//   fileName: 'vendor',
//   filter: 'include',
//   path: [path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
//   extraResources: []
// };
//
// base.addStyleConfig({
//   cssConfig: vendorCSSConfig
// });


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
