module.exports = function(grunt) {
    grunt.initConfig({
        env: {
            dev: {
                NODE_ENV: 'development'
            },
            test: {
                NODE_ENV: 'test'
            }
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    ext: 'js,html',
                    watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
                }
            },
            debug: {
                script: 'server.js',
                options: {
                    nodeArgs: ['--debug'],
                    ext: 'js,html',
                    watch: ['server.js', 'config/**/*.js', 'app/**/*.js']
                }
            }
        },
        mochaTest: {
            src: 'app/tests/**/*.js',
            options: {
                reporter: 'spec'
            }
        },
        jshint: {
            all: {
                src: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js'],
                options: {
                    node: true
                }
            }
        },
        csslint: {
            all: {
                src: 'public/css/**/*.css'
            }
        },
        lesslint: {
            src: ['public/css/**/*.less']
        },
        watch: {
            js: {
                files: ['server.js', 'config/**/*.js', 'app/**/*.js', 'public/js/*.js', 'public/modules/**/*.js'],
                tasks: ['jshint']
            },
            css: {
                files: 'public/modules/**/*.css',
                tasks: ['csslint']
            },
            less: {
                files: 'public/css/**/*.css',
                tasks: ['lesslint']
            }
        },
        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            },
            debug: {
                tasks: ['nodemon:debug', 'watch', 'node-inspector'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        'node-inspector': {
            debug: {}
        }

    });
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-lesslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-node-inspector');

    // grunt
    grunt.registerTask('default', ['env:dev', 'concurrent:dev']);
    //grunt debug
    grunt.registerTask('debug', ['env:dev', 'concurrent:debug']);
    grunt.registerTask('test', ['env:test', 'mochaTest']);
    //grunt lint
    grunt.registerTask('lint', ['jshint', 'csslint', 'lesslint']);
};