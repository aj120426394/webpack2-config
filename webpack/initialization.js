
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = function (env = 'development', context, entry, outputPath, publicPath, alias, devServerPort) {
  // Plugins - HMR
  const nameModules = new webpack.NamedModulesPlugin();

  // Plugins - Get html automatically
  const htmlWebpack = new HtmlWebpackPlugin({
    template: './index.html'
  });

  // Plugins - Automatically loaded modules. Module (value) is loaded when the identifier (key) is used as free constiable in a module. The identifier is filled with the exports of the loaded module.
  const provide = new webpack.ProvidePlugin({
    '$': 'jquery',
    'jQuery': "jquery",
    "window.jQuery": "jquery"
  });

  if (env === 'development') {
    Object.keys(entry).forEach((key) => {
      entry[key].unshift('webpack/hot/only-dev-server');
      entry[key].unshift(`webpack-dev-server/client?http://localhost:${devServerPort}`);
    });
  }


  return ({
    context,
    entry,
    output: {
      path: outputPath,
      publicPath: env === 'development' ? '/' : publicPath,
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash:8].js'
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      modules: ['node_modules', '/app/vendors'],
      alias
    },
    profile: true,
    cache: true,
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader'
            }
          ],
          exclude: /(node_modules|bower_components|vendors)/
        }, {
          test: /\.jsx?$/,
          use: [
            {
              loader: 'babel-loader'
            }
          ],
          include: /estoolbox/
        }, {
          test: /\.(ttf|otf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          },
          exclude: /(node_modules|bower_components|vendors)/
        }, {
          test: /\.(ttf|otf|eot|svg|woff(2)?)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: '/assets/fonts/vendor/[name].[ext]'
          },
          include: /(node_modules|bower_components|vendors)/
        }, {
          test: /\.htaccess$/,
          loader: 'file-loader',
          options: {
            name: '/fonts/[name].[ext]'
          }
        }, {
          test: /\.(jpg|JPG|png|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]'
          },
          exclude: /(node_modules|bower_components|vendors)/
        }, {
          test: /\.(jpg|JPG|png|gif)$/,
          loader: 'file-loader',
          options: {
            name: '/assets/images/vendor/[name].[ext]'
          },
          include: /(node_modules|bower_components|vendors)/
        }, {
          test: /\.hbs$/,
          loader: 'handlebars-loader'
        }, {
          test: /\.html$/,
          loader: 'html-loader'
        }]
    },
    plugins: [
      htmlWebpack,
      provide,
      // (env === 'development' ? hotModuleReplacement : null),
      (env === 'development' ? nameModules : null)
    ]
  });
};
