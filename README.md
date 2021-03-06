
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
const example = new webpack2Config.Base({
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
const prodConfig = example.buildForProduction(['jquery']);
const devConfig = example.buildForDevelopment();
const devServerConfig = example.buildForDevServer(true);
```
* `buildForProduction([lib_name])`: The configuration for production which include:  
    * *Remove Package*
    * *Set NODE_ENV as 'production'*
    * *Minimize the JS file*
    * *Chunk output the library (you need to provide the library's name in an array as the parameter)* 
    
* `buildForDevelopment()`: The configuration for the development which include:
    * *inline Sourcemap*
* `buildForDevServer(verbose)`: The configuration for the dev server which include:
    * *inline Sourcemap*
    * *Hot module replacement*
    
6\. `addStyleConfig()`: The initialized configuration does not include bundling `.sass .scss .css`. But you can use this function to add the style configuration.
 > **Execute this function before execute `buildForDevServer()`, `buildForDevelopment()`, `buildForProduction()`**
```javascript
const cssConfig = {
  filter: '',
  path: [],
  extraResources: [
    path.resolve(__dirname, "node_modules/compass-mixins/lib"),
    path.resolve(__dirname, "app/vendors/materialize/sass")
  ],
  fileName: '',
  prefixWrap: ''
};
example.addStyleConfig(cssConfig)
```
* `cssConfig`:
    * `filter (option)`: This can set the SCSS loader should`'include'` or `'exclude'` the path below during the bundling.
    * `path (option)`: This is the path that you like to include/exclude in the SCSS loader. 
    * `extraResources (option)`: The extra resource that you like to include when you are bundling the SCSS.
    * `prefixWrap (option)`: This is the option that can enable [postcss-prefixwrap](https://github.com/dbtedman/postcss-prefixwrap). If you don't want to enable this function, please do not provide it as parameter.
    * `fileName (option)`: The file name of the css file when it be extracted in the production mode. If you leave it blank, it will become the name of your entry point (js).
    * `fastLoader (option)`: Switching from sass-loader to fast-sass-loader. (Enable this will stop supporting the `sourcemap` and `extraResource` from sass-loader).

7\. `addConfig()`: Add any additional settings into the configuration.
 > **Execute this function before execute `buildForDevServer()`, `buildForDevelopment()`, `buildForProduction()`**
 ```javascript
const extraConfig = {
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ]
};
example.addConfig(extraConfig);
```

## Extra
Some other function that can generate the configuration that can be add in `addConfig()`

* `webpack2-general-config.Style`:
    * `Style.extractSCSStoCSS({env = 'production', filter = '', path = [], extraResources = [], fileName = '', prefixWrap='', fastLoader = false})`
    * `Style.inlineSCSStoCSS({env = 'development', filter = '', path=[], extraResources = [], prefixWrap='', fastLoader = false})`
    * `Style.SCSStoCSSModule({ env = 'development', filter = '', path = [], extraResources = [], sassResource = [], fileName = '', fastLoader = false })`
    * `Style.addSprite({srcFolder, srcType = '*.png', targetImgFolder, targetSCSSFolder, cssImageRef})`:
       ```javascript
        Style.addSprite({
           srcFolder: path.resolve(__dirname, 'app/assets/images/icon'),
           srcType: '*.png',
           targetImgFile: path.resolve(__dirname, 'app/assets/images/sprite.png'),
           targetSCSSFile: path.resolve(__dirname, 'app/scss/abstracts/_sprite.scss'),
           cssImageRef: '../asset/images/sprite.png'
          })
        ```

* `webpack2-general-config.Util`:
    * `Util.devServer({ host = 'localhost', port = 8100 })`
    * `Util.optimize()`
    * `Util.setEnvironmentVariable(variables)`
    * `Util.clean (path)`
    * `Util.providePlugin(provide)`

* `webpack2-general-config.Lint`:
    * `Lint.eslint(path, filter = "exclude")`
    * `Lint.sassLint(path)`
