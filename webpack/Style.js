// import cssnext from 'postcss-cssnext';
// import flexibility from 'postcss-flexibility';
// import sorting from 'postcss-sorting';
// import color_rgba_fallback from 'postcss-color-rgba-fallback';
// import opacity from 'postcss-opacity';
// import pseudoelements from 'postcss-pseudoelements';
// import will_change from 'postcss-will-change';
// import prefixerwrap from 'postcss-prefixwrap';
// import cssnano from 'cssnano';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';

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

module.exports = class Style {
  constructor(prefixerWrap = '') {
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

    if (prefixerWrap !== '') {
      postCSSPlugins.splice(1, 0, prefixerwrap(prefixerWrap));
    }


    this.postCssLoader = {
      loader: 'postcss-loader',
      options: {
        plugins: () => postCSSPlugins
      }
    };
  }


  static createInlineSCSStoCSSConfig ({ prefixWrap = '', cssConfig = {} }) {
    const style = new Style(prefixWrap);
    return style.inlineSCSStoCSS(cssConfig);
  }


  /**
   * Creating the configuration of converting SCSS to inline css.
   * @param {String} env -The controller of dev / prod mode.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @param {Array} path -The regular expression of exclude path.
   * @param {Array} extraResources -The array of the paths of the external resource you want to include.
   * @returns {{module: {rules: [*,*]}}}
   */
  inlineSCSStoCSS({env = 'development', filter = '', path, extraResources = []}) {
    let scssLoader;
    const loaders = [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader',
        options: {
          sourceMap: env === 'development'
        }
      },
      this.postCssLoader,
      {
        loader: 'sass-loader',
        options: {
          sourceMap: env === 'development',
          includePaths: extraResources
        }
      }
    ];
    if (filter === 'exclude') {
      scssLoader = {
        test: /\.scss$/,
        use: loaders,
        exclude: path
      };
    } else if (filter === 'include') {
      scssLoader = {
        test: /\.scss$/,
        use: loaders,
        include: path
      };
    } else {
      scssLoader = {
        test: /\.scss$/,
        use: loaders
      };
    }
    return ({
      module: {
        rules: [
          // Extract CSS during build
          {
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: env === 'development'
                }
              },
              this.postCssLoader
            ]
          },
          scssLoader
        ]
      }
    });
  };

  static createExtractSCSStoCSSConfig({prefixWrap = '', cssConfig = {}}) {
    const style = new Style(prefixWrap);
    return style.extractSCSStoCSS(cssConfig);
  }

  /**
   * Creating the configuration of converting SCSS to extract css.
   * @param {String} env -The controller of dev / prod mode.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @param {Array} path -The regular expression of exclude path.
   * @param {Array} extraResources -The array of the paths of the external resource you want to include.
   * @param {Boolean} vendors -The flag to control if this is extract for vendors.
   * @returns {{module: {rules: [*,*]}, plugins: [*]}}
   */
  extractSCSStoCSS({env = 'production', filter = '', path = [], extraResources = [], vendors = false}) {
    const extractCSS = vendors ?  new ExtractTextPlugin('vendors.[chunkhash].css') : new ExtractTextPlugin('[name].[chunkhash].css');
    let scssLoader;
    const loaders = [
      {
        loader: 'css-loader',
        options: {
          sourceMap: env === 'development'
        }
      },
      this.postCssLoader,
      {
        loader: 'sass-loader',
        options: {
          sourceMap: env === 'development',
          includePaths: extraResources
        }
      }
    ];
    if (filter === 'exclude') {
      scssLoader = {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          loader: loaders
        }),
        exclude: path
      };
    } else if (filter === 'include') {
      scssLoader = {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          loader: loaders
        }),
        include: path
      };
    } else {
      scssLoader = {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          loader: loaders
        })
      };
    }


    return {
      module: {
        rules: [
          // Extract CSS during build
          {
            test: /\.css$/,
            loader: extractCSS.extract({
              fallback: 'style-loader',
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: env === 'development'
                  }
                },
                this.postCssLoader
              ]
            })
          },
          scssLoader
        ]
      },
      plugins: [
        // Output extracted CSS to a file
        extractCSS
      ]
    };
  };


  /**
   * This is a under-testing function for creating the configuration of CSS module.
   * @param {String} env -The environment to decide is dev / prod mode.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @param {Array} path -The regular expression of exclude path.
   * @param {Array} extraResources -The array of the paths of the external resource you want to include.
   * @param {Array} sassResource -The sass resource that will attach to all your scss module. ex. variable.scss
   * @returns {{module: {loaders: [*,*]}, sassLoader: {env: *, includePaths: *}, sassResources: *, plugins: [*]}}
   */
  SCSStoCSSModule({env = 'development', filter = '', path = [], extraResources = [], sassResource = []}) {
    // Sass loader setting for css module:
    const extractCSS = new ExtractTextPlugin('[name].[chunkhash].css');
    const inline = [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          env,
          modules: true,
          importLoaders: 2,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      this.postCssLoader,
      {
        loader: 'sass-loader',
        options: {
          env,
          includePaths: extraResources
        }
      },
      {
        loader: 'sass-resources-loader',
        options: {
          resources: sassResource
        }
      }
    ];

    const extract = extractCSS.extract({
      fallback: 'style-loader',
      loader: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: env === 'development',
            modules: true,
            importLoaders: 2,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        this.postCssLoader,
        {
          loader: 'sass-loader',
          options: {
            sourceMap: env === 'development',
            sourceMapContents: env === 'development',
            includePaths: extraResources
          }
        },
        {
          loader: 'sass-resources-loader',
          options: {
            resources: sassResource
          }
        }
      ]
    });

    let scssLoader;

    if (filter === 'exclude') {
      scssLoader = {
        test: /\.scss$/,
        use: env === 'development' ? inline : extract,
        exclude: path
      };
    } else if (filter === 'include') {
      scssLoader = {
        test: /\.scss$/,
        use: env === 'development' ? inline : extract,
        include: path
      };
    } else {
      scssLoader = {
        test: /\.scss$/,
        use: env === 'development' ? inline : extract
      };
    }

    return {
      module: {
        rules: [
          // Extract CSS during build
          {
            test: /\.css$/,
            loader: extractCSS.extract({
              fallback: 'style-loader',
              loader: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: env === 'development'
                  }
                },
                this.postCssLoader
              ]
            })
          },
          scssLoader
        ]
      },
      plugins: [
        // Output extracted CSS to a file
        extractCSS
      ]
    };
  };
}


