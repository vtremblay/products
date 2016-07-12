'use strict';

/**
 * The following grunt specific package are used
 *  * grunt-env : use to define environment specific stuff
 *  * grunt-mocha-cov : to run the unit test and measure code coverage
 *  *
 *  *
 *  For the test always include helper.js first to make that the paths for require are properly resolved
 * @param grunt
 */

module.exports = function (grunt) {

    grunt.file.readJSON("package.json");

    grunt.initConfig({
        env: {
            mochaTest: {
                APP_DIR_FOR_CODE_COVERAGE: '/../',
                SOAJS_SRVIP: '127.0.0.1'
            },
            coverage: {
                APP_DIR_FOR_CODE_COVERAGE: '/../test/coverage/instrument/',
                SOAJS_SRVIP: '127.0.0.1'
            }
        },
        jshint: {
            options: {
                "bitwise": true,
                "eqeqeq": true,
                "forin": true,
                "newcap": true,
                "strict": true,
                "noarg": true,
                "undef": true,
                "unused": false,
                "eqnull": true,
                "laxcomma": true,
                "loopfunc": true,
                "sub": true,
                "supernew": true,
                "validthis": true,
                "node": true,
                "maxerr": 100,
                "indent": 2,
                "esversion": 6,
                "globals": {
                    "describe": false,
                    "it": false,
                    "before": false,
                    "beforeEach": false,
                    "after": false,
                    "afterEach": false
                },
                ignores: ['test/coverage/**/*.js', 'node_modules/**/*.js', 'jsdoc/*']
            },
            files: {
                src: ['**/*.js']
            },
            gruntfile: {
                src: 'Gruntfile.js'
            }
        },
        mochaTest: {
            unit: {
                options: {
                    reporter: 'spec',
                    timeout: 90000
                },
                src: ['test/helper.js', 'test/unit/**/*.js']
            },
            integration: {
                options: {
                    reporter: 'spec',
                    timeout: 90000
                },
                src: ['test/helper.js', 'test/integration/**/*.js']
            }
        },
        clean: {
            coverage: {
                src: ['test/coverage/']
            }
        },

        instrument: {
            files: ['index.js', 'config.js', 'service/*.js', 'daemon/*.js'],
            options: {
                lazy: false,
                basePath: 'test/coverage/instrument/'
            }
        },
        storeCoverage: {
            options: {
                dir: 'test/coverage/reports'
            }
        },

        makeReport: {
            src: 'test/coverage/reports/**/*.json',
            options: {
                type: 'lcov',
                dir: 'test/coverage/reports',
                print: 'detail'
            }
        },
        jsdoc: {
            dist: {
                src: ['service/*.js', 'index.js'],
                options: {
                    destination: 'jsdoc'
                }
            }
        }

    });
    let npmTasks = ['grunt-env', 'grunt-jsdoc', 'grunt-mocha-test', 'grunt-contrib-jshint', 'grunt-contrib-clean', 'grunt-istanbul'];
    for (let i = 0; i < npmTasks.length; i++) {
        grunt.loadNpmTasks(npmTasks[i]);
    }
    grunt.registerTask("doc", ['jsdoc']);
    grunt.registerTask("test:unit", ['env:mochaTest', 'mochaTest:unit']);
    grunt.registerTask("test:integration", ['env:mochaTest', 'mochaTest:integration']);
    grunt.registerTask("test", ['env:mochaTest', 'mochaTest:integration', 'mochaTest:unit']);
    grunt.registerTask("coverage", ['clean', 'env:coverage', 'instrument', 'mochaTest:unit', 'mochaTest:integration', 'storeCoverage', 'makeReport']);
};
