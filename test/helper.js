'use strict';
/**
 * Check https://gist.github.com/branneman/8048520
 * When first executed in the sequence it eliminates the need to
 * put ../../../ ...  in the path of the require statements
 * for all the test files.
 */
require('app-module-path').addPath(__dirname + process.env.APP_DIR_FOR_CODE_COVERAGE);