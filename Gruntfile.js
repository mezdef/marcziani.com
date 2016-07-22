'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // # Plugin: Shell
    shell: {
      clean: {
        command: 'rm -rf .tmp .jekyll _site',
      },
      // sync: { command: 's3_website push', },
    },
    clean: ['.tmp', '.jekyll', '_site'],

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
        files: ['**/*.{html,haml,md,mkd,markdown,rb,svg,xml,yml}', '!_site/**/.{html,md,rb,svg,xml,yml}'],
        tasks: ['jekyll:server'],
      },
    },

    // # Plugin: Jekyll
    jekyll: {
      options: {
        // config: '_config.yml,_config.build.yml',
        src: './',
      },
      server: {
        options: {
          config: '_config.yml',
          dest: '.jekyll/',
          // quiet: true,
          // incremental: true,
        },
      },
      dist: {
        options: {
          dest: '_site',
          quiet: true,
        },
      },
      layout: {
        options: {
          config: '_config.yml',
          dest: '.jekyll/',
          quiet: true,
          // incremental: true,
        },
      },
    },

    // # Plugin: Less
    less: {
      server: {
        options: {
          paths: ['assets/'],
        },
        files: { '.tmp/assets/screen.min.css': 'assets/_screen.less' },
      },
      dist: {
        options: {
          paths: ['assets/'],
          plugins: [
          ],
        },
        // compilation.css  :  source.less
        files: { '_site/assets/screen.min.css': 'assets/_screen.less' },
      },
    },

    postcss: {
      options: {
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')({
            browsers: [
              '>0.1%', 'ie 8', 'chrome 6', 'firefox 20', 'safari 4', 'opera 12',
              'android 4', 'ios_saf 4', 'op_mini all', 'samsung 4',
            ],
          }), // add vendor prefixes
          // require('cssnano')() // minify the result
        ]
      },
      server: {
        src: '.tmp/assets/screen.min.css'
      },
      dist: {
        src: '_site/assets/screen.min.css'
      },
    },

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

    // # Plugin: Minify JS
    uglify: {
      options: {
        preserveComments: false,
      },
      server: {
        files: [{
          expand: true, // Extensions in filenames begin after the first dot
          src: ['assets/js/*.js'], // Extensions in filenames begin after the first dot
          dest: '.tmp/', // Extensions in filenames begin after the first dot
          ext: '.min.js', // Extensions in filenames begin after the first dot
          extDot: 'first', // Extensions in filenames begin after the first dot
        }],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/js/',
          src: ['**/*.js'],
          dest: '_site/assets/js/',
          ext: '.min.js',
          extDot: 'first',
        }],
      },
    },

    // # Task: Html Minification
    // htmlmin: {                                     // Task
    //   dist: {                                      // Target
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
    //       cwd: '_site',
    //       src: '**/*.html',
    //       dest: '_site',
    //     }],
    //   },
    // },

    // # Plugin: Copy files
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: './',
          src: [
            // Jekyll processes and moves HTML and text files.
            // Usemin moves CSS and javascript inside of Usemin blocks.
            // Copy moves asset files and directories.
            'img/**/*',
            // Like Jekyll, exclude files & folders prefixed with an underscore.
            '!**/_*{,/**}',
            // Explicitly add any files your site needs for distribution here.
            'favicon*.{ico,png}'
          ],
          dest: '_site'
        }]
      },
    },

    concurrent: {
      server: [ 'less', 'jekyll:server' ],
      dist: [ 'less', 'copy:dist' ],
    },

    // # Plugin: Browser Sync
    browserSync: {
      server: {
        bsFiles: {
          src: [
            '.jekyll/**/*.html',
            '.tmp/assets/*.css',
            '.tmp/assets/js/*.min.js',
            '.tmp/assets/**/*.{gif,jpg,jpeg,png,svg}',
          ]
        },
        options: {
          // baseDir: [ '.jekyll', '.tmp',],
          browser: "google chrome canary",
          watchTask: true,
          server: ['.tmp', '.jekyll'],
        },
      },
    },


    // confirm: {
    //   sync: {
    //     options: {
    //       question: 'Syncing website to S3. Continue?',
    //       input: '_key:y'
    //     }
    //   }
    // }
  });
  require('load-grunt-tasks')(grunt);

  // Task: Serve
  grunt.registerTask('serve', function(target) {
    if (target === 'dist') { return grunt.task.run(['build', 'browserSync:dist']); }
    grunt.task.run([
      'shell:clean',
      'clean',
      'jekyll:server',
      'less:server',
      'uglify:server',
      'browserSync:server',
      'watch',
    ]);
  });

  // Task: Build
  grunt.registerTask('build', [
    'shell:clean',
    'clean',
    'jekyll:dist',
    'less:dist',
    'postcss:dist',
    'less:dist',
    'copy:dist',
    'uglify:dist',
    // 'htmlmin',
    // 'critical',
    // 'imagemin',
    // 'svgmin',
  ]);

  // grunt.registerTask('dev', ['clean:dist', 'jekyll:dist', 'less', 'uglify:dist', 'concurrent:all']);
  // grunt.registerTask('confirm', ['confirm:sync']);
  // grunt.registerTask('sync', ['clean:dist', 'jekyll:dist', 'less', 'shell:sync']);
};
