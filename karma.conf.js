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
    frameworks: [ 'phantomjs-shim', 'mocha', 'chai'],
    // singleRun: true,
    webpack: webpackCfg,
    webpackServer: {
      noInfo: true
    },
    babelPreprocessor: {
      options: {
        presets: ['es2015']
      }
    },
    reporters: [ 'mocha', 'progress', 'coverage-istanbul' ],
    coverageIstanbulReporter: {
      reports: [ 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    plugins:[
      'karma-phantomjs-shim',
      'karma-mocha',
      'karma-chai',

    ]
  });
};
