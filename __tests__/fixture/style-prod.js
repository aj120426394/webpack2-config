const HtmlWebpackPlugin = require('html-webpack-plugin');
const cssnext = require('postcss-cssnext');
const flexibility = require('postcss-flexibility');
const sorting = require('postcss-sorting');
const color_rgba_fallback = require('postcss-color-rgba-fallback');
const opacity = require('postcss-opacity');
const pseudoelements = require('postcss-pseudoelements');
const will_change = require('postcss-will-change');
const prefixerwrap = require('postcss-prefixwrap');
const cssnano = require('cssnano');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].[chunkhash].css');

const postCSSPlugins = [
  cssnext({
    browsers: [
      "Android >= 2.3",
      "BlackBerry >= 7",
      "Chrome >= 9",
      "Firefox >= 4",
      "Explorer >= 9",
      "iOS >= 5",
      "Opera >= 11",
      "Safari >= 5",
      "OperaMobile >= 11",
      "OperaMini >= 6",
      "ChromeAndroid >= 9",
      "FirefoxAndroid >= 4",
      "ExplorerMobile >= 9"
    ]
  }),
  cssnano({
    // 关闭cssnano的autoprefixer选项，不然会和前面的autoprefixer冲突
    autoprefixer: false,
    reduceIdents: false,
    zindex: false,
    discardUnused: false,
    mergeIdents: false
  }),
  flexibility,
  will_change,
  color_rgba_fallback,
  opacity,
  pseudoelements,
  sorting
];

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => postCSSPlugins
  }
};


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
      }, {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: false
            }
          },
          postCssLoader
        ]
      }, {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          loader: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: false
              }
            },
            postCssLoader,
            {
              loader: 'sass-loader',
              options: {
                sourceMap: false,
                includePaths: []
              }
            }
          ]
        })
      }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    null,
    extractCSS
  ]
};
