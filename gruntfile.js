'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        outputStyle: 'compressed',
        precision: 10,
        sourceMap: false,
      },
      dist: {
        files: {
          'main.min.css': 'source/scss/main.scss',
        },
      },
    },
    concat: {
      main: {
        src: ['node_modules/normalize.css/normalize.css', 'main.min.css'],
        dest: 'main.min.css',
      },
    },
    uncss: {
      dist: {
        options: {
          ignore: ['.popover.inactive', '.*.ng-*', '.js-*', /::?-[\w\d]+/],
          stylesheets: ['main.min.css'],
          ignoreSheets: ['/fonts.googleapis/', '/brick.a.ssl.fastly.net/'],
        },
        files: {
          'main.min.css': ['index.html'],
        },
      },
    },
    postcss: {
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions'],
          }),
        ],
      },
      dist: {
        src: 'main.min.css',
        dest: 'main.min.css',
      },
    },
    csscomb: {
      main: {
        src: 'main.min.css',
        dest: 'main.min.css',
      },
    },
    cssmin: {
      options: {
        keepSpecialComments: 1,
        roundingPrecision: -1,
        aggressiveMerging: true,
        advanced: true,
      },
      main: {
        src: 'main.min.css',
        dest: 'main.min.css',
      },
    },
    browserify: {
      dist: {
        files: {
          'main.min.js': ['source/js/main.js'],
        },
        options: {},
      },
    },
    uglify: {
      options: {
        mangle: false,
        compress: {
          drop_console: false,
        },
        report: {
          gzip: true,
        },
      },
      dist: {
        files: {
          'main.min.js': ['main.min.js'],
        },
      },
    },
    jade: {
      compile: {
        options: {
          data: {
            dev: false,
          },
        },
        files: [{
          expand: true,
          cwd: 'source/templates/',
          src: ['{,*/}*.jade'],
          dest: '',
          ext: '.html',
        }],
      },
    },
    htmlmin: {
      dist: {
        options: {
          caseSensitive: true,
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: false,
          keepClosingSlash: false,
          minifyCSS: true,
          minifyJS: true,
          minifyURLs: true,
          removeAttributeQuotes: false,
          removeCDATASectionsFromCDATA: true,
          removeComments: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeEmptyElements: false,
          removeIgnored: true, //
          removeOptionalTags: true, //
          removeRedundantAttributes: false,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        },
        files: {
          'index.html': 'index.html',
        },
      },
    },
    jsonlint: {
      themelib: {
        src: ['source/json/themelib.json'],
      },
    },
    watch: {
      options: {
        spawn: false,
        interrupt: true,
        event: ['changed'],
        livereload: {
          host: '192.168.1.4',
          port: 35729,
        },
      },
      css: {
        files: ['source/scss/**/*.scss'],
        tasks: ['sass', 'concat', 'postcss', 'cssmin'],
      },
      jade: {
        files: ['source/templates/**/*.jade'],
        tasks: ['jade', 'htmlmin', 'sass', 'concat', 'postcss', 'cssmin'],
      },
      js: {
        files: ['source/js/**/*.js'],
        tasks: ['browserify', 'uglify'],
      },
      json: {
        files: ['source/json//**/*.json'],
        tasks: ['jsonlint', 'jade', 'htmlmin', 'sass', 'concat', 'postcss', 'cssmin'],
      },
      gruntfile: {
        files: ['gruntfile.js', 'source/json//**/*.json'],
        tasks: [],
        options: {
          reload: true,
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-jsonlint');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.registerTask('default', ['watch']);
};
