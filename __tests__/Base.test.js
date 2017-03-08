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

describe("Prod configuration", () =>{
  const base = new Base({
    context: CONTEXT,
    entry: ENTRY,
    outputPath: OUTPUT_PATH,
    publicPath: PUBLIC_PATH,
    alias: ALIAS,
    devServerPort: DEV_SERVER_PORT,
    htmlPath: './index.html'
  });
  test("Default", () => {
    expect(base.prodConfig).toMatchObject(defaultSetting);
  });
  //
  // test("Add Extract Style", () => {
  //   const cssConfig = {
  //     filter: '',
  //     path: [],
  //     extraResources: EXTRA_SCSS_RESOURCES
  //   };
  //   base.addStyleConfig({
  //     config: cssConfig
  //   });
  //   expect(base.prodConfig).toMatchObject(defaultStyleSetting);
  // })
});

