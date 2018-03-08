/**
 * Created by Administrator on 2017/10/16.
 */

var path = require('path');
var includeRegExp = new RegExp('@@include\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)');

module.exports = function(grunt) {
    var serveStatic = require('serve-static');

    var config = {
        web: 'web',
        dist: 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        config: config,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*'
                    ]
                }]
            }
        },
        includereplace: {
            dist: {
                options: {
                    prefix: '@@',
                    suffix: '',
                    wwwroot: './',
                    globals: {
                        webapi: global.webapi,
                        DEBUG: 1,
                        BUILD: new Date().getTime()
                    },
                    includesDir: '',
                    docroot: '.'
                },
                src: '<%= config.dist %>/**/*.{js,html}',
                dest: './'
            }
        },
        jshint: {
            dist: [
                '<%= config.web %>/js/*.js',
                '!<%= config.web %>/js/echarts.min.js',
            ]
        },
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: '<%= config.web %>/index.html'
        },
        usemin: {
            html: ['<%= config.dist %>/**/*.html']
        },
        uglify: {
            dist: {
                files: [
                    {
                        '<%= config.dist %>/js/w3cplus.min.js': [
                            '<%= config.dist %>/../bower_components/jquery/dist/jquery.min.js',
                            '<%= config.dist %>/../bower_components/swiper/dist/js/swiper.min.js',
                            '<%= config.dist %>/js/w3cplus.js'
                        ]
                    }
                ]
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded',
                    sourcemap: false
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.web %>/scss/',
                        src: ['*.scss'],
                        dest: '<%= config.web %>/css/',
                        ext: '.css'
                    }
                ]
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.web %>/',
                        src: 'css/*.css',
                        dest: '<%= config.web %>/'
                    }
                ]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= config.dist %>/css/w3cplus.min.css': [
                        '<%= config.dist %>/../bower_components/normalize.css/normalize.css',
                        '<%= config.dist %>/../bower_components/swiper/dist/css/swiper.min.css',
                        '<%= config.dist %>/css/w3cplus.css'
                    ]
                }
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.web %>',
                        dest: '<%= config.dist %>',
                        src: [
                            '**/*.{html,js,css}',
                            '**/*.{png,jpg,gif}'
                        ]
                    }
                ]
            }
        },
        watch: {
            scripts: {
                files: ['<%= config.web %>/js/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: ['<%= config.web %>/scss/*.scss'],
                tasks: ['sass', 'autoprefixer']
            },
            styles: {
                files: ['<%= config.web %>/css/*.css'],
                tasks: ['autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.web %>/*.html'
                ]
            }
        },
        connect: {
            options: {
                port: 9000,
                open: false,
                livereload: 35729,
                hostname: '*'
            },
            livereload: {
                options: {
                    base: '<%= config.web %>',
                    middleware: function(connect){
                        return [
                            connect().use('/bower_components', serveStatic('./bower_components')),
                            function(req, res, next) {
                                //include
                                var filePath = req.url,
                                    fileDir = path.dirname(filePath),
                                    body;

                                if (-1 == filePath.indexOf('.html')) {
                                    body = grunt.file.read(config.web + filePath);
                                } else {
                                    console.log('request - %s', config.web + filePath);
                                    body = grunt.file.read(config.web + filePath);
                                    var matches = includeRegExp.exec(body);

                                    while (matches) {
                                        var match = matches[0];
                                        var includePath = matches[1];
                                        //var localVars = matches[3] ? JSON.parse(matches[3]) : {};

                                        console.log('include - %s', config.web + fileDir + includePath);
                                        body = body.replace(match, grunt.file.read(config.web + fileDir + includePath));

                                        matches = includeRegExp.exec(body);
                                    }
                                }

                                return res.end(body);
                            }
                        ];
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-usemin');

    //server
    grunt.registerTask('server', [
        'sass:dist',
        'autoprefixer:dist',
        'connect:livereload',
        'watch'
    ]);

    //build
    grunt.registerTask('build', [
        'clean:dist',
        'sass:dist',
        //'jshint',
        'copy:dist',
        'useminPrepare',
        'usemin',
        'includereplace:dist',
        'autoprefixer:dist',
        'cssmin:dist',
        'uglify'
    ]);

    // Default task(s).
    grunt.registerTask('default');

};