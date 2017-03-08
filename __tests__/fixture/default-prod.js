const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  context: './app',
  entry: {
    app: ['./js/index.js']
  },
  output: {
    path: './dist',
    publicPath: 'http://jafoteng.co/mfs/',
    filename: '[name].[hash].js',
    chunkFilename: '[name].[chunkhash:8].js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', '/app/vendors'],
    alias: {
      materialize: './app/vendors/materialize/js/bin/materialize.js',
      hammerjs: './app/vendors/materialize/js/hammer.min.js'
    }
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
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    null
  ]
};
