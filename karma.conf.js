var webpackCfg = require('./karma/webpack.config.test.js');

module.exports = function(config) {
  config.set({
    basePath: '',
    browsers: [ 'PhantomJS' ],
    files: [
      './karma/testfiles.js'
    ],
    port: 8080,
    captureTimeout: 60000,
    frameworks: [ 'phantomjs-shim', 'mocha', 'chai', 'sinon', 'sinon-chai'],
    client: {
      mocha: {}
    },
    // singleRun: true,
    reporters: [ 'mocha', 'coverage' ],
    preprocessors: {
      './karma/testfiles.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },
    babelPreprocessor: {
      options: {
        presets: ['react']
      }
    },
    coverageReporter: {
      dir: './test/coverage/',
      reporters: [
        { type: 'html' },
        { type: 'text' }
      ]
    }
  });
};
