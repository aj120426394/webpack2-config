// import webpack from 'webpack';
// import merge from 'webpack-merge';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import Util from 'Util';

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const os = require('os');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const Util = require('./Util');
const Style = require('./Style');
const Lint = require('./Lint');

module.exports = class Base {
  /**
   * @constructor
   *
   * @param {String} context - The path of your source file directory.
   * @param {Object} entry - The entry point of your project. Using an Array to wrap the entry point.
   * @param {String} outputPath - The output path of the project.
   * @param {String} publicPath - The public path of the project.
   * @param {Object} alias - Alias of the webpack in your application.
   * @param {Number} devServerPort - The port number for dev server.
   * @param {String} htmlPath - The path of the html file of your project.
   * @param {boolean} localhost - Determine to use localhost or current machine's ip address
   */
  constructor({ context, entry, outputPath, publicPath, alias, devServerPort = 8100, htmlPath = '', localhost = true }) {
    this.context = context;
    this.entry = entry;
    this.outputPath = outputPath;
    this.publicPath = publicPath;
    this.alias = alias;
    this.devServerPort = devServerPort;
    this.htmlPath = htmlPath;
    this.host = localhost ? 'localhost' : Util.getIPAddress();

    this.devConfig = this.initialization('development');
    this.prodConfig = this.initialization('production');
  }

  initialization(env = 'development') {
    // const entries = JSON.parse(JSON.stringify(this.entry));
    const entries = Util.duplicateObject(this.entry);

    if (env === 'development') {
      Object.keys(entries).forEach((key) => {
        entries[key].unshift('webpack/hot/only-dev-server');
        entries[key].unshift(`webpack-dev-server/client?http://localhost:${this.devServerPort}`);
      });
    }

    const plugins = [new webpack.NamedModulesPlugin()];
    if (this.htmlPath !== '') {
      plugins.unshift(new HtmlWebpackPlugin({
        template: this.htmlPath
      }));
    }

    return ({
      context: this.context,
      entry: entries,
      output: {
        path: this.outputPath,
        publicPath: env === 'development' ? `http://localhost:${this.devServerPort}/` : this.publicPath,
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash:8].js'
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', '/app/vendors'],
        alias: this.alias
      },
      profile: env === 'development',
      cache: env === 'development',
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
            test: /\.(ttf|otf|eot|svg|woff(2)?|ico)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]'
            },
            exclude: /(node_modules|bower_components|vendors)/
          }, {
            test: /\.(ttf|otf|eot|svg|woff(2)?|ico)(\?v=\d+\.\d+\.\d+)?$/,
            loader: 'file-loader',
            options: {
              name: '/assets/fonts/vendor/[name].[ext]'
            },
            include: /(node_modules|bower_components|vendors)/
          }, {
            test: /\.htaccess$/,
            loader: 'file-loader',
            options: {
              name: '[name]'
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
            test: /\.html$/,
            loader: 'html-loader'
          }]
      },
      plugins
    });
  }


  /**
   * Adding the style configuration to the webpack setting.
   *  - Using inlineCSS in the development environment
   *  - Extract the css file in production environment
   *
   * @param {Object} cssConfig - The CSS configuration with: {filter, path, extraResources, fileName, prefixWrap}.
   */
  addStyleConfig(cssConfig = {}) {
    const devConfig = Util.duplicateObject(cssConfig);
    devConfig.evn = 'development';
    const prodConfig = Util.duplicateObject(cssConfig);
    prodConfig.env = 'production';
    this.devConfig = merge(this.devConfig, Style.inlineSCSStoCSS(devConfig));
    this.prodConfig = merge(this.prodConfig, Style.extractSCSStoCSS(prodConfig));
  }

  /**
   * Add additional configuration into the setting.
   *
   * @param {Object} config - The webpack configuration format Object.
   * @param {String} env - Set 'development' if the additional configuration only be used in development environment.
   *                     - Set 'production' if the additional configuration only be used in production environment.
   *                     - Set '' or non-provide if the additional configuration be used in any environment.
   */
  addConfig({ config = {}, env = '' }) {
    if (env === 'development') {
      this.devConfig = merge(this.devConfig, config);
    } else if (env === 'production') {
      this.prodConfig = merge(this.prodConfig, config);
    } else {
      this.devConfig = merge(this.devConfig, config);
      this.prodConfig = merge(this.prodConfig, config);
    }
  }

  /**
   * Building the webpack configuration for production.
   *
   * @param {Array} extractLibrary - The set of library you want to extract to a separate js file.
   * @returns {*}
   */
  buildForProduction(extractLibrary = []) {
    let config = merge(
      this.prodConfig,
      Util.clean(this.outputPath),
      Util.setEnvironmentVariable({
        NODE_ENV: 'production'
      }),
      Util.extractJSBundle({
        name: 'vendor',
        entries: extractLibrary
      }),
      Util.optimize()
    );

    if (extractLibrary.length !== 0) {
      config = merge(
        config,
        Util.extractJSBundle({
          name: 'vendor',
          entries: extractLibrary
        })
      );
    }
    return config;
  }

  /**
   * Building webpack configuration for development
   * @returns {*}
   */
  buildForDevelopment() {
    const config = merge(
      this.devConfig,
      Util.clean(this.outputPath),
      {
        devtool: 'inline-source-map'
      }
    );
    return config;
  }

  /**
   * Building webpack configuration for dev Server.
   *
   * {Boolean} verbose -The controller for output detail.
   * @returns {*}
   */
  buildForDevServer(verbose = false) {
    const config = merge(
      this.devConfig,
      {
        devtool: 'inline-source-map',
        plugins: [
          new OpenBrowserPlugin({ url: `http://${this.host}:${this.devServerPort}` })
        ]
      },
      Util.devServer({
        host: 'localhost',
        port: this.devServerPort,
        verbose: verbose
      })
    );
    return config;
  }

};
