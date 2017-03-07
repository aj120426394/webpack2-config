'use strict';

require('core-js/fn/object/assign');
require('core-js/es5');
// Add support for all files in the test directory
const testsContext = require.context('../spec', true, /\.spec.js$/);
testsContext.keys().forEach(testsContext);
