'use strict';
module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // # Plugin: Clean
    clean: {
      server: ['.tmp', '_site'],
      dist: ['_site'],
    },

    // # Plugin: Watch
    watch: {
      less: {
        files: ['assets/**/*.less'],
        tasks: ['less:server', 'autoprefixer'],
      },
      scripts: {
        files: ['assets/**/*.js'],
        tasks: ['uglify'],
      },
      jekyll: {
        files: ['**/*.{html,haml,md,mkd,markdown,rb,svg,xml,yml}', '!_site/**/.{html,md,rb,svg,xml,yml}'],
        tasks: ['jekyll:server'],
      },
    },

    // # Plugin: Jekyll
    jekyll: {
      options: {
        config: '_config.yml,_config.build.yml',
        src: './',
      },
      server: {
        options: {
          config: '_config.yml',
          dest: '.jekyll/',
          // incremental: true,
        },
      },
      dist: {
        options: {
          dest: '_site',
          quiet: true,
        },
      },
    },

    // # Plugin: Less
    less: {
      server: {
        compile: {
          files: { '.tmp/assets/screen.css': 'assets/screen.less' },
        },
      },
      dist: {
        compile: {
          options: {
            compress: true,
            yuicompress: true,
            optimization: 2,
          },
          // compilation.css  :  source.less
          files: { '_site/assets/screen.css': 'assets/screen.less' },
        },
      },
    },

    // # Plugin: Uncss for unused css rules
    // uncss: {
    //   options: {
    //     htmlroot: '<%= app.dist %>/<%= app.baseurl %>',
    //     report: 'gzip'
    //   },
    //   dist: {
    //     files: {
    //       '_site/assets/screen.min.css': ['app/index.html', 'app/about.html']
    //     }
    //   }
    //   dist: {
    //     src: '_site/**/*.html',
    //     dest: '.tmp/<%= app.baseurl %>/css/blog.css'
    //   }
    // },

    // # Plugin: CSS Prefixing
    autoprefixer: {
      options: {
        browsers: ['last 3 versions'],
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/assets/',
          src: '**/*.css',
          dest: '.tmp/assets/',
        }],
      },
    },

    // # Plugin: Minify CSS
    cssmin: {
      dist: {
        options: {
          keepSpecialComments: 0,
          check: 'gzip',
        },
        files: [{
          expand: true,
          cwd: '.tmp/assets/',
          src: '**/*.css',
          dest: '.tmp/assets/',
        }],
      },
    },

    // lesslint: {
    //   src: ['./**/*.less']
    // },

    // # Plugin: Minify JS
    uglify: {
      options: {
        preserveComments: false,
      },
      dist: {
        files: [{
          // Enable dynamic expansion.
          expand: true,
          // Src matches are relative to this path.
          cwd: 'assets/js/',
          // Actual pattern(s) to match.
          src: ['**/*.js'],
          // Destination path prefix.
          dest: '.tmp/assets/js/',
          // Dest filepaths will have this extension.
          ext: '.min.js',
          // Extensions in filenames begin after the first dot
          extDot: 'first',
        }],
      },
    },

    // # Task: Html Minification
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          removeEmptyAttributes: true,
          minifyJS: true,
          minifyCSS: true,
        },
        files: [{
          expand: true,
          cwd: '_site',
          src: '**/*.html',
          dest: '_site',
        }],
      },
    },

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
      options: {
        ui: {
          port: 4000,
        },
        browser: "google chrome canary",
      },
      server: {
        bsFiles: {
          src: [
            '.jekyll/**/*.html',
            '.tmp/css/**/*.css',
            '{.tmp,./}/js/**/*.js',
            'assets/img/**/*.{gif,jpg,jpeg,png,svg}'
          ]
        },
        options: {
          server: {
            baseDir: [
              '.jekyll',
              '.tmp',
              './'
            ]
          },
          watchTask: true
        }
      },
      dist: {
        options: {
          server: {
            baseDir: '_site'
          }
        }
      }
    },

    // shell: {
    //   sync: {
    //     command: 's3_website push'
    //   }
    // },

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
  i

  // Task: Serve
  grunt.registerTask('serve', function(target) {
    if (target === 'dist') { return grunt.task.run(['build', 'browserSync:dist']); }
    grunt.task.run([
      'clean:server',
      'concurrent:server',
      'jekyll:server',
      'less:server',
      'autoprefixer',
      'uglify',
      'browserSync:server',
      'watch',
    ]);
  });

  // Task: Build
  grunt.registerTask('build', [
    'clean:dist',
    'jekyll:dist',
    'concurrent:dist',
    'less:dist',
    // 'uncss',
    'autoprefixer',
    'cssmin',
    'uglify',
    // 'htmlmin',
    // 'critical',
    // 'imagemin',
    // 'svgmin',
  ]);

  // grunt.registerTask('dev', ['clean:dist', 'jekyll:dist', 'less', 'uglify:dist', 'concurrent:all']);
  // grunt.registerTask('confirm', ['confirm:sync']);
  // grunt.registerTask('sync', ['clean:dist', 'jekyll:dist', 'less', 'shell:sync']);
};
