module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // # Task: Clean
    clean: {
      dev: ['_site']
    },
    // # Task: Jekyll
    jekyll: {
      // Build website from scratch
      dist: {
        options: {
          dest: './_site'
        }
      },
      // Build website with only Haml and Md
      haml: {
        options: {
          dest: './_site',
          exclude: ['./**', '!./**/*.haml', '!./**/*.md'],
          quiet: true
        }
      },
      // Start up server
      serve: {
        options: {
          serve: true,
          watch: true,
          incremental: true
        }
      }
    },
    // # Task: Less
    less: {
      compile: {
        options: {
          compress: true,
          yuicompress: true,
          optimization: 2
        },
        files: {
          // compilation.css  :  source.less
          '_site/assets/screen.css': 'assets/screen.less'
        }
      }
    },
    // # Task: Watch
    watch: {
      options: {
        livereload: true
      },
      html: {
        files: [
          '**/*.haml',
          '**/*.md',
        ],
        // Regen Haml files
        tasks: ['jekyll:haml']
      },
      styles: {
        files: ['assets/**/*.less'],
        tasks: ['less']
      }
    },
    // # Task: Concurrent
    concurrent: {
      all: {
        tasks: ['jekyll:serve', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    shell: {
      sync: {
        command: 's3_website push'
      }
    },
    confirm: {
      sync: {
        options: {
          question: 'Syncing website to S3. Continue?',
          input: '_key:y'
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('dev', ['clean:dev', 'less', 'concurrent:all']);
  grunt.registerTask('confirm', ['confirm:sync']);
  grunt.registerTask('sync', ['clean:dev', 'jekyll:dist', 'less', 'shell:sync']);
};
