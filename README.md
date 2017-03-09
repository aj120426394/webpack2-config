
# [Webpack2 configuration](https://github.com/aj120426394/webpack2-config) [![Build Status](https://travis-ci.org/aj120426394/webpack2-config.svg?branch=master)](https://travis-ci.org/aj120426394/webpack2-config) [![NPM Version](https://img.shields.io/npm/v/webpack2-general-config.svg)](https://www.npmjs.com/package/webpack2-general-config)

*This is the configuration module for webpack2*

## Contributors

* [Jeff Teng](mailto:j.teng@griffith.edu.au)

## Dependencies

* [Node (v7)](https://nodejs.org)
* [NPM (v3)](https://www.npmjs.com)

## Getting Started

1\. Ensure all [Dependencies](#dependencies) have been resolved.

2\. Install application dependencies.

```bash
npm install webpack2-general-config
```

3\. Import the module into your webpack configuration file.

```bash
const webpack2Config = require('webpack2-genral-config');
```

4\. To use the default settings, initialize the config first. Then there will be 3 different modes of output.
```javascript
const base = new webpack2Config.Base({
  context: '',
  entry: {},
  outputPath: '',
  publicPath: '',
  alias: {},
  devServerPort: 8100,
  htmlPath: './index.html'
});
```
* `context`: The indicator for the webpack plugins to point where is your source code directory. `ex. path.join(__dirname, 'app')`
* `entry`: The entry points of your project. You can have multiple entry points, please refer to [Webpack website](https://webpack.js.org/configuration/) `ex. {app:['./js/index.js']}`
* `outputPath`: Your project's output path. `ex. path.join(__dirname, 'dist')`
* `publicPath`: Please refer to publicPath at [Webpack website](https://webpack.js.org/configuration/) `ex. https://github.com/aj120426394/`
* `alias`: Please refer to resolve.alias at [Webpack website](https://webpack.js.org/configuration/) `ex. {materialize: path.resolve(__dirname, 'app/vendors/materialize/js/bin/materialize.js')}`
* `devServerPort`: The port number you would like to use for the dev-server. `ex. 8100`
* `htmlPath`: The main HTML file of your project. `ex. ./index.html` (As we set the context for the webpack, you can use relative path for rest of the setting)

5\. After initialized the configuration, you can have the config output with 3 different modes.
```javascript
const prodConfig = base.buildForProduction();
const devConfig = base.buildForDevelopment(['jquery']);
const devServerConfig = base.buildForDevServer();
```
* `buildForProduction([lib_name])`: The configuration for production which include:  
    * *Remove Package*
    * *Set NODE_ENV as 'production'*
    * *Minimize the JS file*
    * *Chunk output the library (you need to provide the library's name in an array as the parameter)* 
    
* `buildForDevelopment()`: The configuration for the development which include:
    * *inline Sourcemap*
* `buildForDevServer()`: The configuration for the dev server which include:
    * *inline Sourcemap*
    * *Hot module replacement*
    
6\. `addStyleConfig()`: The initialized configuration does not include style `.sass .scss .css`. But you can use this function to add the style configuration.
 > **Execute this function before execute `buildForDevServer()`, `buildForDevelopment()`, `buildForProduction()`**
```javascript
const cssConfig = {
  filter: '',
  path: [],
  extraResources: [
    path.resolve(__dirname, "node_modules/compass-mixins/lib"),
    path.resolve(__dirname, "app/vendors/materialize/sass")
  ]
};
base.addStyleConfig({
    cssConfig: cssConfig,
    prefixWrap: '.class-name'
})
```
* `cssConfig`:
    * `filter (option)`: This can set the SCSS loader should`'include'` or `'exclude'` the path below during the bundling.
    * `path (option)`: This is the path that you like to include/exclude in the SCSS loader. 
    * `extraResources (option)`: The extra resource that you like to include when you are bundling the SCSS.
* `prefixWrap (option)`: This is the option that can enable [postcss-prefixwrap](https://github.com/dbtedman/postcss-prefixwrap). If you don't want to enable this function, please do not provide it as parameter.


## Extra
In this package it also provide some other configuration that you can use [webpack-merge](https://github.com/survivejs/webpack-merge) to merge into the default configuration. 

* `webpack2-genral-config.Style`:
    * `extractSCSStoCSS({env = 'development', filter = '', path, extraResources = []})`:
    * `inlineSCSStoCSS({env = 'development', filter = '', path = [], extraResources = []})`:

* `webpack2-genral-config.Util`:
    * `devServer({ host = 'localhost', port = 8100 })`
    * `optimize()`
    * `setEnvironmentVariable(variables)`
    * `clean (path)`
