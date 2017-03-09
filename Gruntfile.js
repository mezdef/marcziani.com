module.exports = function(grunt) {
  'use strict';
  // require('jit-grunt')(grunt);
  require('jit-grunt')(grunt, { s3: 'grunt-aws', });
  require('time-grunt')(grunt);
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // # Plugin: Shell tasks
    shell: {
      // sync: { command: 's3_website push', },,,
      dir: { command: 'mkdir -p .tmp .jekyll', },
      clean: { command: 'rm -rf .tmp .jekyll _site', },
    },

    // # Plugin: Haml generation for index files
    haml: {
      dist: {
        files: {
          'index.html': '_pages/index.haml',
          'about.html': '_pages/about.haml',
          'writing.html': '_pages/index.haml', // Index is mirrored
          'photos.html': '_pages/photos.haml',
          'projects.html': '_pages/projects.haml',
          '404.html': '_pages/404.haml',
        },
      },
    },

    // # Plugin: Process that cleans up after jekyll
    clean: {
      dist: ['index.html', 'about.html', 'witing.html', 'photos.html',  'projects.html', '404.html'],
      start: ['_site/', '.jekyll/*', '.tmp/*'],
    },

    // # Plugin: Jekyll build process for html generation
    jekyll: {
      options: {
        src: './',
        config: '_config.yml',
        quiet: true, drafts: true, future: true,
        incremental: true,
      },
      server: { options: { dest: '.tmp/', }, },
      dist: { options: { dest: '_site/', }, },
    },

    // # Plugin: Less process to generate css
    less: {
      options: {
        paths: ['assets/'],
      },
      server: { files: { '.tmp/assets/screen.min.css': 'assets/_screen.less' }, },
      dist: { files: { '_site/assets/screen.min.css': 'assets/_screen.less' }, },
    },

    // # Plugin: Minify styles from less generated css
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

    // # Plugin: Minify js process
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

    // # Plugin: Minify process that moves images
    imagemin: {
      options: {
        optimizationLevel: 3,
        svgoPlugins: [{ removeViewBox: false }],
        // use: [mozjpeg()]
      },
      dist: {
        files: [{
          expand: true,
          src: ['assets/img/*.{png,jpg,gif,svg}'],
          dest: '_site/'
        }],
      },
    },

    // # Plugin: Process to copy site for dev server
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

    // # Plugin: Watch process for server
    watch: {
      options: {
        spawn: false,
      },
      less: {
        files: ['assets/**/*.less'],
        tasks: ['bsReload:css', 'less:server', 'postcss:server'],
      },
      scripts: {
        files: ['assets/**/*.js'],
        tasks: ['uglify:server'],
      },
      jekyll: {
        files: [
          '_includes/**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          '_layouts/**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          '_pages/**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          '_plugins/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          'photos/**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          'projects/**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
          'writing/**/*.{haml,md,mkd,markdown,rb,svg,xml,yml}',
        ],
        tasks: ['haml:dist', 'jekyll:dist', 'copy:server', 'clean:dist'],
      },
    },

    // # Plugin: Browser Sync
    browserSync: {
      server: {
        options: {
          watchTask: true,
          server: '.tmp/',
          browser: "google chrome canary",
          plugins: [{
            module: "bs-html-injector",
            options: { files: [ '.tmp/**/*.html', ], },
          }],
        },
      },
      dist: {
        options: {
          watchTask: true,
          server: '_site/',
          browser: "google chrome canary",
          plugins: [{
            module: "bs-html-injector",
            options: { files: [ '_site/**/*.html', ], },
          }],
        },
      },
    },
    bsReload: {
      css: ".tmp/**/*.css",
    },

    // # Plugin: Concurrent Tasks
    concurrent: {
      dist: ['less:dist', 'uglify:dist', 'imagemin:dist', 'copy:dist'],
    },

    // # Plugin: Upload to S3
    aws: grunt.file.readJSON("credentials.json"),
    s3: {
      options: {
        accessKeyId: "<%= aws.accessKeyId %>",
        secretAccessKey: "<%= aws.secretAccessKey %>",
        bucket: "<%= aws.bucket %>",
        region: "<%= aws.region %>"
      },

      //upload all files within build/ to root
      deploy: {
        cwd: "_site/",
        src: "**"
      },
    },
  });

  // Task: Build
  grunt.registerTask('build', [
    'clean:start', 'shell:dir',
    'haml:dist',
    'jekyll:dist',
    'concurrent:dist',
    'postcss:dist',
    'clean:dist',
  ]);

  grunt.registerTask('dev', ['build', 'copy:server', 'browserSync:server', 'watch']);
  grunt.registerTask('test', ['build', 'copy:dist', 'browserSync:dist', 'watch']);
  grunt.registerTask('deploy', ['build', 'copy:dist', 's3:deploy']);
};

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
