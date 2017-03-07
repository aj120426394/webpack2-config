const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = class Lint{

  /**
   * Creating a ES linting configuration for webpack.
   * @param {Array} path -The array of the path should be included or excluded.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @returns {{module: {preLoaders: [*]}}}
   */
  static eslint(path, filter = "exclude") {
    let eslintLoader;
    if (filter === "exclude") {
      eslintLoader = {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: path
      };
    } else {
      eslintLoader = {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        include: path
      };
    }
    return {
      module: {
        rules: {
          eslintLoader
        }
      }
    }
  };


  /**
   * Creating a Sass linting configuration for webpack.
   * @param {String[]} path - Path of the linting scss file
   * @returns {{plugins: [*]}}
   */
  static sassLint(path) {
    // files: ['/scss/**/*.s?(a|c)ss'],
    return {
      plugins: [
        new StyleLintPlugin({
          configFile: '.stylelintrc.yml',
          files: path,
          syntax: 'scss',
          failOnError: false,
        })
      ]
    }
  };
}
