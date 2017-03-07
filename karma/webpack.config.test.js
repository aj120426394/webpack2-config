let path = require('path');
let srcPath = path.join(__dirname, '../webpack');
let testPath = path.join(__dirname, '../spec');
const webpack = require('webpack');

const provide= new webpack.ProvidePlugin({
  '$': 'jquery'
});

module.exports = {
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|woff|woff2|css|sass|scss|less|styl)$/,
        loader: 'null-loader'
      },
      {
        test: /\.(js|jsx)$/,
        use: [
          {
            loader: 'isparta-loader',
            enforce: 'pre',
            include: [srcPath]
          },
          {
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              presets: ['es2015']
            }
          }
        ]
      }
    ]
  },
  externals: {
    "jsdom": "window",
    "cheerio": "window"
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    alias: {
    }
  },
  plugins: [
    provide
  ]
};
