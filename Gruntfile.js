// This is the main application configuration file. It is a Grunt
// configuration file, which you can learn more about here:
// https://github.com/cowboy/grunt/blob/master/docs/configuring.md
/*jslint nomen: true*/
// 'use strict';
// module.exports = function (grunt) {
//     'use strict';
//     grunt.initConfig({
//         // The clean task ensures the entire XXX folder is removed
//         clean: {
//             development: ['_site'],
//             staging: ['_staging'],
//             production: ['_production']
//         },
//
//         // Compress generated css files
//         cssmin: {
//                 'css/screen.css': ['css/screen.css']
//         },
//
//         // Run Jekyll
//         jekyll: {
//             // server: {
//           jekyll: {                             // Task
//             options: {                          // Universal options
//             },
//             dist: {                             // Target
//               options: {                        // Target options
//                 // dest: '<%= dist %>',
//                 // config: '_config.yml,_config.build.yml'
//               }
//             },
//             serve: {                            // Another target
//               options: {
//                 serve: true,
//                 dest: './_site',
//               }
//             }
//           }
//                 // auto: true,
//                 // server: true,
//                 // server_port: 4000,
//                 // exclude: ['node_modules', 'less'],
//                 // dest: './_site'
//         },
//         //     staging: {
//         //         url: 'http://some.url/',
//         //         exclude: ['node_modules', 'less'],
//         //         dest: './_staging'
//         //     },
//         //     production: {
//         //         exclude: ['node_modules', 'less'],
//         //         dest: './_production'
//         //     }
//         // },
//
//         // Automatically run a task when a file changes
//         watch: {
//             styles: {
//                 files: [
//                     'css/less/*'
//                 ],
//                 tasks: 'less'
//             }
//         },
//
//         // Compile specified less files
//         less: {
//             compile: {
//                 options: {
//                     // These paths are searched when trying to resolve @import in less file
//                     paths: [
//                         'css/less'
//                     ]
//                 },
//                 files: {
//                     'css/screen.css': 'css/less/screen.less'
//                 }
//             }
//         },
//
//         // Add shell tasks
//         shell: {
//             copyCss: {
//                 command: 'cp css/screen.css _site/css/screen.css'
//             }
//         }
//     });
//
//     grunt.loadNpmTasks('grunt-contrib-watch');
//     grunt.loadNpmTasks('grunt-contrib-clean');
//     grunt.loadNpmTasks('grunt-contrib-cssmin');
//     grunt.loadNpmTasks('grunt-contrib-less');
//     grunt.loadNpmTasks('grunt-jekyll');
//     grunt.loadNpmTasks('grunt-shell');
//
//     // The default task will show the usage
//     grunt.registerTask('default', 'Prints usage', function () {
//         grunt.log.writeln('');
//         grunt.log.writeln('Product site development');
//         grunt.log.writeln('------------------------');
//         grunt.log.writeln('');
//         grunt.log.writeln('* run "grunt --help" to get an overview of all commands.');
//         grunt.log.writeln('* run "grunt dev"" to start developing.');
//     });
//
//     // The dev task will be used during development
//     // grunt.registerTask('dev', ['clean:development', 'less:compile', 'jekyll:server', 'watch:jekyll', 'watch:styles']);
//     grunt.registerTask('dev', ['clean:development', 'less:compile', 'jekyll', 'watch:styles']);
//
//     // The stag task will be used before "deploying" to staging (subfolder of a domain)
//     grunt.registerTask('stag', ['clean:staging', 'less:compile', 'jekyll:staging']);
//
//     // The prod task will be used before "deploying" to product (root of a domain)
//     grunt.registerTask('prod', ['clean:production', 'less:compile', 'jekyll:production']);
// };

module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Compile specified less files
    less: {
      compile: {
        options: {
          // Specifies directories to scan for @import directives when parsing.
          // Default value is the directory of the source, which is probably what you want.
          // paths: [
            // 'assets/_less'
          // ]
          // compress: true,
          // yuicompress: true,
          // optimization: 2
        },
        files: {
          // compilation.css  :  source.less
          'assets/screen.css': 'assets/screen.less'
        }
      }
    },

    // cssmin: {
    //   css: {
    //     // src: 'css/main.css',
    //     // dest: 'css/main.min.css'
    //   }
    // },
    jekyll: {
      dist: {
        options: {
          dest: './_site',
        }
      }
    },
    watch: {
      // options: {
        // livereload: true,
      // },
      // css: {
      //   files: ['_css/*', '_less/*'],
      //   tasks: ['less', 'concat:css', 'cssmin:css']
      // },
      styles: {
        files: [
          'assets/_less/**'
        ],
        tasks: ["less", "copy:css"]
      },
      // html: {
      //   files: ['*.html', '_includes/*.html', '_layouts/*.html', '_posts/*'],
      //   tasks: ['jekyll'],
      //   options: {
      //     spawn: false,
      //   }
      // }
    },
    connect: {
      server: {
        options: {
          port: 4000,
          base: './_site'
        }
      }
    }
  });

require('load-grunt-tasks')(grunt);

grunt.registerTask('default', ['less', 'jekyll']);
grunt.registerTask('css', ['less', 'concat:css', 'cssmin:css']);
grunt.registerTask('server', ['connect', 'watch']);
};
