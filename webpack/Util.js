const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// import webpack from 'webpack'
// import CleanWebpackPlugin from 'clean-webpack-plugin';


module.exports = class Util{
  /**
   * Creating a webpack dev-server configuration with customize host and port.
   * @param {String} host -The address you want to host this project
   * @param {Number} port -The port you want to host this porject.
   * @returns {{devServer: {historyApiFallback: boolean, hot: boolean, inline: boolean, stats: string, host: *, port: *}, plugins: [*]}}
   */
  static devServer({ host = 'localhost', port = 8100 }) {
    return {
      devServer: {
        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        // Unlike the cli flag, this doesn't set
        // HotModuleReplacementPlugin!
        hot: true,
        inline: true,
        // Display only errors to reduce the amount of output.
        // stats: 'errors-only',
        // Parse host and port from env to allow customization.
        //
        // If you use Vagrant or Cloud9, set
        // host: options.host || '0.0.0.0';
        //
        // 0.0.0.0 is available to all network devices
        // unlike default `localhost`.
        host, // Defaults to `localhost`
        port // Defaults to 8080
      },
      plugins: [
        // Enable multi-pass compilation for enhanced performance
        // in larger projects. Good default.
        new webpack.HotModuleReplacementPlugin({
          multiStep: false
        })
      ]
    };
  };


  /**
   * Creating a webpack UglifyJS / Dedupe / NoErrors plugin configuration.
   * - Plugins - Search for equal or similar files and deduplicate them in the output.
   * - Plugins - When there are errors while compiling this plugin skips the emitting phase (and recording phase), so there are no assets emitted that include errors.
   * - Plugins - Compress the JS bundle
   *
   * @returns {{plugins: [*]}}
   */
  static optimize() {
    return {
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          // Don't beautify output (enable for neater output)
          beautify: false,
          // Eliminate comments
          comments: false,
          compress: {
            warnings: false,
            drop_console: true
          },
          sourceMap: false,
          mangle: {
            except: ['$', 'jQuery']
          }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
        new webpack.NoEmitOnErrorsPlugin()
      ]
    };
  }

  static duplicateObject(obj) {
    const output = {};
    Object.keys(obj).forEach(key => {
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        output[key] = this.duplicateObject(obj[key]);
      } else if (Object.prototype.toString.call(obj[key]) === '[object Array]') {
        output[key] = obj[key].slice();
      } else {
        output[key] = obj[key];
      }
    });
    return output;
  }

  /**
   * Creating a webpack configuration for environment variable.
   * @param {String} key - The variable key.
   * @param {String} value - The value you would like to assign.
   * @returns {{plugins: [*]}}
   */
// exports.setFreeVariable = function (key, value) {
//   const env = {};
//   env[key] = JSON.stringify(value);
//
//   return {
//     plugins: [
//       new webpack.DefinePlugin(env)
//     ]
//   };
// };

  /**
   * Creating a webpack configuration for environment variable.
   * @param {String[]} variables - The list of the variable.
   * @returns {{plugins: [*]}}
   */
  static setEnvironmentVariable(variables) {
    // const env = variables;
    return {
      plugins: [
        new webpack.EnvironmentPlugin(variables)
      ]
    };
  };

  /**
   * Creating a webpack extract bundle configuration, extract the webpack runtime setting and some library.
   * @param {String} name -The name of the extract js file.
   * @param {Array} entries -The path of the js file.
   * @returns {{entry: {}, plugins: [*]}}
   */
  static extractJSBundle({name = '', entries = []}) {
    let names = ['manifest'];
    const entry = {};
    if (!name && name.length !== 0 && !entries && entries.length !== 0 ) {
      entry[name] = entries;
      names.unshift(name);
    }

    return {
      // Define an entry point needed for splitting.
      entry,
      plugins: [
        // Extract bundle and manifest files. Manifest is
        // needed for reliable caching.
        new webpack.optimize.CommonsChunkPlugin({
          names: names
        })
      ]
    };
  };

  /**
   * Creating a webpack cleaning plugin configuration to delete the old version of the production folder.
   * @param {String} path -The path of the production folder.
   * @returns {{plugins: [*]}}
   */
  static clean (path) {
    return {
      plugins: [
        new CleanWebpackPlugin([path], {
          // Without `root` CleanWebpackPlugin won't point to our
          // project and will fail to work.
          root: process.cwd()
        })
      ]
    };
  };

  static providePlugin( provide={} ) {
    const providePlugin = new webpack.ProvidePlugin(provide);
    return {
      plugins: [
        new providePlugin (provide)
      ]
    };
  }
};
