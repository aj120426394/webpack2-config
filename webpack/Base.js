// import webpack from 'webpack';
// import merge from 'webpack-merge';
// import HtmlWebpackPlugin from 'html-webpack-plugin';
// import Util from 'Util';

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Util = require('./Util');
const Style = require('./Style');
const Lint = require('./Lint');

module.exports = class Base{
  constructor({ context, entry, outputPath, publicPath, alias, devServerPort = 8100, htmlPath = './index.html' }){
    this.context = context;
    this.entry = entry;
    this.outputPath = outputPath;
    this.publicPath = publicPath;
    this.alias = alias;
    this.devServerPort = devServerPort;
    this.htmlWebpack = new HtmlWebpackPlugin({
      template: htmlPath
    });
    this.devConfig = this.initialization('development');
    this.prodConfig = this.initialization('production');
  }

  initialization( env = 'development' ){
    const entry = Object.assign({}, this.entry);

    if (env === 'development') {
      Object.keys(entry).forEach((key) => {
        entry[key].unshift('webpack/hot/only-dev-server');
        entry[key].unshift(`webpack-dev-server/client?http://localhost:${this.devServerPort}`);
      });
    }

    return ({
      context: this.context,
      entry: entry,
      output: {
        path: this.outputPath,
        publicPath: env === 'development' ? '/' : this.publicPath,
        filename: '[name].[hash].js',
        chunkFilename: '[name].[chunkhash:8].js'
      },
      resolve: {
        extensions: ['.js', '.jsx'],
        modules: ['node_modules', '/app/vendors'],
        alias: this.alias
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
        this.htmlWebpack,
        // (env === 'development' ? hotModuleReplacement : null),
        (env === 'development' ? new webpack.NamedModulesPlugin() : null)
      ]
    });
  }

  addStyleConfig({ cssConfig , prefixWrap }) {
    const style = new Style(prefixWrap);
    const devConfig = Object.assign({}, cssConfig);
    devConfig['env'] = 'development';
    const prodConfig = Object.assign({}, cssConfig);
    prodConfig['env'] = 'production';

    this.devConfig = merge(this.devConfig, style.inlineSCSStoCSS(devConfig));
    this.prodConfig = merge(this.prodConfig, style.extractSCSStoCSS(prodConfig));
  }

  buildForProduction(){
    const config = merge(
      this.prodConfig,
      Util.clean(this.outputPath),
      Util.setEnvironmentVariable({
        NODE_ENV: 'production'
      }),
      Util.extractJSBundle({
        name: 'vendor',
        entries: ['jquery']
      }),
      Util.optimize()
    );
    return config;
  }

  buildForDevelopment(){
    const config = merge(
      this.devConfig,
      {
        devtool: 'inline-source-map'
      }
    );
    return config;
  }

  devWithDevServer() {
    const config = merge(
      this.devConfig,
      {
        devtool: 'inline-source-map'
      },
      Util.devServer({
        host: 'localhost',
        port: this.devServerPort
      })
    );
    return config;
  }
}
