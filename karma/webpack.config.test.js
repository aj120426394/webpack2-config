let path = require('path');
let srcPath = path.join(__dirname, '../app');
let testPath = path.join(__dirname, '../spec');
var webpack = require('webpack');

const provide= new webpack.ProvidePlugin({
  '$': 'jquery'
});

module.exports = {
  devtool: 'eval',
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'isparta-loader',
        include: [
          srcPath
        ]
      }
    ],
    loaders: [
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['airbnb']
        }
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ]
  },
  externals: {
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
    'react/addons': true,
    "jsdom": "window",
    "cheerio": "window"
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
      "component": path.join(__dirname, "./app/component"),
      "store": path.join(__dirname, "./app/redux/store")
    }
  },
  plugins: [
    provide
  ]
};
