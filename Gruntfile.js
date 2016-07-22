'use strict';
module.exports = function(grunt) {
  // require('time-grunt')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // # Plugin: Shell tasks
    shell: {
      // sync: { command: 's3_website push', },
      dir: { command: 'mkdir .tmp .jekyll _site', },
      clean: { command: 'rm -rf .tmp .jekyll _site', },
    },

    // # Plugin: Jekyll HTML generation
    jekyll: {
      options: {
        src: './',
        config: '_config.yml',
        // quiet: true, drafts: true, future: true,
        // incremental: true,
      },
      server: { options: { dest: '.jekyll/', }, },
      dist: { options: { dest: '_site/', }, },
    },

    // # Plugin: Less processing
    less: {
      options: {
        paths: ['assets/'],
      },
      server: { files: { '.tmp/assets/screen.min.css': 'assets/_screen.less' }, },
      dist: { files: { '_site/assets/screen.min.css': 'assets/_screen.less' }, },
    },

    // # Plugin: Minify CSS
    postcss: {
      options: {
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({
            browsers: [
              '>0.1%', 'ie 8', 'chrome 6', 'firefox 20', 'safari 4', 'opera 12',
              'android 4', 'ios_saf 4', 'op_mini all', 'samsung 4',
            ],
          }),
          // require('cssnano')() // minify the result
        ]
      },
      server: { src: '.tmp/assets/screen.min.css' },
      dist: { src: '_site/assets/screen.min.css' },
    },

    // # Plugin: Minify JS
    uglify: {
      options: { preserveComments: false, },
      server: {
        files: [{
          expand: true,
          src: ['assets/js/*.js'], ext: '.min.js',
          dest: '.tmp/',
        }],
      },
      dist: {
        files: [{
          expand: true,
          src: ['assets/js/*.js'], ext: '.min.js',
          dest: '_site/',
        }],
      },
    },

    // # Plugin: Minify Images
    imagemin: {
      options: {
        optimizationLevel: 3,
        svgoPlugins: [{ removeViewBox: false }],
        // use: [mozjpeg()]
      },
      dist: {
        files: [{
          expand: true,
          src: ['assets/img/*.{png,jpg,gif}'],
          dest: '_site/'
        }],
      },
    },

    // # Plugin: Copy files
    copy: {
      server: {
        expand: true,
        cwd: '_site/',
        src: '**',
        dest: '.tmp/',
      },
      dist: {
        files: [{
          expand: true,
          src: [ 'assets/img/favicon.{ico,png}' ],
          dest: '_site/',
        }],
      },
    },

    // // # Plugin: Minify Html
    // htmlmin: {                                     // Task
    //   server: {                                      // Target
    //     options: {                                 // Target options
    //       removeComments: true,
    //       collapseWhitespace: true,
    //       collapseBooleanAttributes: true,
    //       removeAttributeQuotes: true,
    //       removeRedundantAttributes: true,
    //       removeEmptyAttributes: true,
    //       minifyJS: true,
    //       minifyCSS: true,
    //     },
    //     files: [{
    //       expand: true,
    //       // src: '.jekyll/**/*.html',
    //       // dest: './',
    //       src: '.jekyll/**/*.html',
    //       dest: './',
    //     }],
    //   },
    // },

    // # Plugin: Watch
    watch: {
      less: {
        files: ['assets/**/*.less'],
        tasks: ['less:server', 'postcss:server'],
      },
      scripts: {
        files: ['assets/**/*.js'],
        tasks: ['uglify:server'],
      },
      jekyll: {
        files: [
          '**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          // '!tmp/**/*.{html,haml,md,mkd,markdown,rb,svg,xml,yml}',
          // '!_site/**/.{html,md,rb,svg,xml,yml}',
          // '!.tmp/**/.{html,md,rb,svg,xml,yml}',
          '!tmp/**',
          '!.tmp/**',
          '!.jekyll/**',
          '!_site/**',
          '!node_modules/**',
          // '!node_modules/**/.{html,md,rb,svg,xml,yml}',
        ],
        tasks: ['jekyll:server'],
      },
    },

    // # Plugin: Browser Sync
    browserSync: {
      options: {
        watchTask: true,
        browser: "google chrome canary",
      },
      server: {
        bsFiles: {
          src: [
            '.jekyll/**/*.html', '!.jekyll/tmp/**/*.html',
            '.tmp/assets/*.css', '.tmp/assets/js/*.min.js',
            '.tmp/assets/**/*.{gif,jpg,jpeg,png,svg}',
          ],
        },
        options: {
          server: ['.tmp/', '.jekyll/'],
          // injectChanges: true,
        },
      },
      // dist: {
      //   bsFiles: {
      //     src: [
      //       '_site/**/*.html', '!_site/tmp/**/*.html',
      //       '_site/assets/*.css', '_site/assets/js/*.min.js',
      //       '_site/assets/**/*.{gif,jpg,jpeg,png,svg}',
      //     ],
      //   },
      //   options: {
      //     server: '_site/',
      //   },
      // },
    },

    // confirm: {
    //   sync: {
    //     options: {
    //       question: 'Syncing website to S3. Continue?',
    //       input: '_key:y'
    //     }
    //   }
    // }

    // csslint: {
    //   src: ['.tmp/assets/screen.min.css']
    // },
    //
    // lesslint: {
    //   options: {
    //     imports: ['assets'],
    //   },
    //   src: ['assets/**/*.less'],
    // },

    // # Plugin: Concurrent Tasks
    concurrent: {
      dist: ['less:dist', 'uglify:dist', 'imagemin:dist', 'copy:dist'],
    },

  });
  require('load-grunt-tasks')(grunt);

  // Task: Build
  grunt.registerTask('build', [
    'shell:clean', 'shell:dir',
    'jekyll:dist',
    'concurrent:dist',
    'postcss:dist',
  ]);

  // Task: Development
  grunt.registerTask('dev', ['build', 'copy:server', 'browserSync:server', 'watch']);
  grunt.registerTask('test', ['build', 'browserSync:dist', 'watch']);
  // grunt.registerTask('sync', ['build', 'shell:sync']);
};
