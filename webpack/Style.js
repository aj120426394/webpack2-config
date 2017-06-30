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
const SpritesmithPlugin = require('webpack-spritesmith');

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
        plugins: () => postCSSPlugins,
        sourceMap: true
      }
    };
  }

  static creatPostCSSLoader(env = 'development', prefixerWrap = '') {
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
      flexibility,
      will_change,
      color_rgba_fallback,
      opacity,
      pseudoelements,
      sorting
    ];

    if (env === 'production') {
      const index = postCSSPlugins.indexOf(flexibility);
      postCSSPlugins.splice(index, 0, cssnano({
        // 关闭cssnano的autoprefixer选项，不然会和前面的autoprefixer冲突
        autoprefixer: false,
        reduceIdents: false,
        zindex: false,
        discardUnused: false,
        mergeIdents: false
      }));
    }

    if (prefixerWrap !== '') {
      postCSSPlugins.splice(1, 0, prefixerwrap(prefixerWrap));
    }


    return {
      loader: 'postcss-loader',
      options: {
        plugins: () => postCSSPlugins,
        sourceMap: env === 'development'
      }
    };
  }


  // static createInlineSCSStoCSSConfig({prefixWrap = '', cssConfig = {}}) {
  //   const style = new Style(prefixWrap);
  //   return style.inlineSCSStoCSS(cssConfig);
  // }


  /**
   * Creating the configuration of converting SCSS to inline css.
   * @param {String} env -The controller of dev / prod mode.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @param {Array} path -The regular expression of exclude path.
   * @param {Array} extraResources -The array of the paths of the external resource you want to include.
   * @param {String} prefixWrap -The prefix for each element in CSS.
   * @returns {{module: {rules: [*,*]}}}
   */

  static inlineSCSStoCSS({env = 'development', filter = '', path=[], extraResources = [], prefixWrap=''}) {
    const postCssLoader = this.creatPostCSSLoader(env, prefixWrap);
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
      postCssLoader,
      // {
      //   loader: 'fast-sass-loader'
      // }
      {
        loader: 'resolve-url-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
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
              postCssLoader
            ]
          },
          scssLoader
        ]
      }
    });
  };

  // static createExtractSCSStoCSSConfig({prefixWrap = '', cssConfig = {}}) {
  //   const style = new Style(prefixWrap);
  //   return style.extractSCSStoCSS(cssConfig);
  // }

  /**
   * Creating the configuration of converting SCSS to extract css.
   * @param {String} env -The controller of dev / prod mode.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @param {Array} path -The regular expression of exclude path.
   * @param {Array} extraResources -The array of the paths of the external resource you want to include.
   * @param {String} fileName -The name of the extracted CSS file.
   * @param {String} prefixWrap -The class name that wrap all other element.
   * @returns {{module: {rules: [*,*]}, plugins: [*]}}
   */
  static extractSCSStoCSS({env = 'production', filter = '', path = [], extraResources = [], fileName = '', prefixWrap=''}) {
    const postCssLoader = this.creatPostCSSLoader(env, prefixWrap);
    const extractName = fileName === '' ? '[name].[chunkhash].css' : `${fileName}.[chunkhash].css`;
    const extractCSS = new ExtractTextPlugin({
      filename: extractName,
      allChunks: true
    });
    let scssLoader;
    const loaders = [
      {
        loader: 'css-loader',
        options: {
          sourceMap: env === 'development'
        }
      },
      postCssLoader,
      // {
      //   loader: 'fast-sass-loader'
      // }
      {
        loader: 'resolve-url-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
          includePaths: extraResources
        }
      }
    ];
    if (filter === 'exclude') {
      scssLoader = {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: loaders
        }),
        exclude: path
      };
    } else if (filter === 'include') {
      scssLoader = {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: loaders
        }),
        include: path
      };
    } else {
      scssLoader = {
        test: /\.scss$/,
        loader: extractCSS.extract({
          fallback: 'style-loader',
          use: loaders
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
                postCssLoader
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
  }

  /**
   * This is a under-testing function for creating the configuration of CSS module.
   * @param {String} env -The environment to decide is dev / prod mode.
   * @param {String} filter -The flag to control it's "exclude" or "include" the path.
   * @param {Array} path -The regular expression of exclude path.
   * @param {Array} extraResources -The array of the paths of the external resource you want to include.
   * @param {Array} sassResource -The sass resource that will attach to all your scss module. ex. variable.scss
   * @param {String} fileName -The file name of the extracted CSS file.
   * @returns {{module: {loaders: [*,*]}, sassLoader: {env: *, includePaths: *}, sassResources: *, plugins: [*]}}
   */
  static SCSStoCSSModule({env = 'development', filter = '', path = [], extraResources = [], sassResource = [], fileName = ''}) {
    const postCssLoader = this.creatPostCSSLoader(env);
    // Sass loader setting for css module:
    const extractName = fileName === '' ? '[name].[chunkhash].css' : `${fileName}.[chunkhash].css`;
    const extractCSS = new ExtractTextPlugin({
      filename: extractName,
      allChunks: true,
      ignoreOrder: true
    });

    // const extractCSS = new ExtractTextPlugin('[name].[chunkhash].css');
    const inline = [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          sourceMap: env === 'development',
          modules: true,
          importLoaders: 2,
          localIdentName: '[name]__[local]___[hash:base64:5]'
        }
      },
      postCssLoader,
      {
        loader: 'resolve-url-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          sourceMap: true,
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
      use: [
        {
          loader: 'css-loader',
          options: {
            sourceMap: env === 'development',
            modules: true,
            importLoaders: 2,
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        },
        postCssLoader,
        {
          loader: 'resolve-url-loader'
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
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
              use: [
                {
                  loader: 'css-loader',
                  options: {
                    sourceMap: env === 'development'
                  }
                },
                postCssLoader
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
   * Providing the configuration of sprite with SpriteSmith
   * @param {String} srcFolder -The image source folder that you like to make sprite with.
   * @param {String} srcType -The image file type that your provide.
   * @param {String} targetImgFolder -The directory that you like to save the sprite image output.
   * @param {String} targetSCSSFolder -The director that you like to save the sprite scss output.
   * @param {String} cssImageRef -The relative path from scss file to the image output file.
   * @returns {{plugins: [*]}}
   *
   * @example
   * Style.addSprite({
   *  srcFolder: path.resolve(__dirname, 'app/assets/images/icon'),
   *  srcType: '*.png',
   *  targetImgFile: path.resolve(__dirname, 'app/assets/images/sprite.png'),
   *  targetSCSSFile: path.resolve(__dirname, 'app/scss/abstracts/_sprite.scss'),
   *  cssImageRef: '../asset/images/sprite.png'
   * })
   */
  static addSprite({srcFolder, srcType = '*.png', targetImgFolder, targetSCSSFolder, cssImageRef}) {
    const spritesmith = new SpritesmithPlugin({
      src: {
        cwd: srcFolder,
        glob: srcType
      },
      target: {
        image: targetImgFolder,
        css: [
          [targetSCSSFolder, {
            format: 'scss'
          }]
        ]
      },
      apiOptions: {
        cssImageRef: cssImageRef
      }
    });
    return {
      plugins: [
        spritesmith
      ]
    }
  }
};


