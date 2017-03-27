import Base from '../webpack/Base';
import Style from '../webpack/Style';

import defaultSetting from './fixture/default-prod';
import defaultStyleSetting from './fixture/style-prod';

const CONTEXT = './app';
const DEV_SERVER_PORT = 8100;
const ENTRY = {
  app: [
    './js/index.js'
  ]
};
const OUTPUT_PATH = './dist';
const PUBLIC_PATH = 'http://jafoteng.co/mfs/';
const ALIAS = {
  materialize: './app/vendors/materialize/js/bin/materialize.js',
  hammerjs: './app/vendors/materialize/js/hammer.min.js'
};
const POSTCSS_PREFIXWRAP = {
  enablePostcssPrefixWrap: true,
  prefixClassName: '.module-0-sub'
};
const EXTRA_SCSS_RESOURCES = [];
const SASS_RESOURCES = ["./app/scss/app.scss"];

describe("The Base configuration should", () => {
  const base = new Base({
    context: CONTEXT,
    entry: ENTRY,
    outputPath: OUTPUT_PATH,
    publicPath: PUBLIC_PATH,
    alias: ALIAS,
    devServerPort: DEV_SERVER_PORT,
    htmlPath: './index.html'
  });
  test('assign default configuration when only required configuration is set', () => {
    expect(base.prodConfig).toMatchObject(defaultSetting);
  });
});
