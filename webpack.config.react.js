const webpackConfig = require('./main');
const path = require('path');

const react = new webpackConfig.React({
  context: path.join(__dirname, 'app-react'),
  entry: {
    app: ['./index.jsx']
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
  filter: 'include',
  path: [/(node_modules|bower_components|vendors)/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
  extraResources: [
    path.resolve(__dirname, "node_modules/compass-mixins/lib"),
    path.resolve(__dirname, "app/vendors/materialize/sass")
  ]
};

// react.addStyleConfig(cssConfig);
//
react.addModuleStyleConfig({
  filter: 'exclude',
  path: [/(node_modules)/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
  sassResource: [path.resolve(__dirname, "app/scss/app.scss")]
});
react.addExtractStyleConfig({
  filter: 'include',
  path: [/(node_modules)/, path.resolve(__dirname, "app/scss/vendors"), path.resolve(__dirname, "app/vendors")],
  extraResources: [
    path.resolve(__dirname, "node_modules/compass-mixins/lib"),
    path.resolve(__dirname, "app/vendors/materialize/sass")
  ]
});
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
    config = react.buildForProduction(['jquery', 'react']);
    break;
  case 'build:dev':
    config = react.addConfig({
      config: webpackConfig.Util.clean(path.resolve(__dirname, 'dist'))
    });
    config = react.buildForDevelopment();
    break;
  default:
    config = react.buildForDevServer();
}
// console.log(config);
module.exports = config;
