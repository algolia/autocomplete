'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    version: grunt.file.readJSON('package.json').version,

    buildDir: 'dist',

    banner: [
      '/*!',
      ' * autocomplete.js <%= version %>',
      ' * https://github.com/algolia/autocomplete.js',
      ' * Copyright <%= grunt.template.today("yyyy") %> Algolia, Inc. and other contributors; Licensed MIT',
      ' */'
    ].join('\n'),

    usebanner: {
      all: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },
        files: {
          src: [ 'dist/*.js' ]
        }
      }
    },

    uglify: {
      jquery: {
        src: '<%= buildDir %>/autocomplete.jquery.js',
        dest: '<%= buildDir %>/autocomplete.jquery.min.js'
      },
      angular: {
        src: '<%= buildDir %>/autocomplete.angular.js',
        dest: '<%= buildDir %>/autocomplete.angular.min.js'
      },
      standalone: {
        src: '<%= buildDir %>/autocomplete.js',
        dest: '<%= buildDir %>/autocomplete.min.js'
      },
    },

    browserify: {
      jquery: {
        src: 'index_jquery.js',
        dest: '<%= buildDir %>/autocomplete.jquery.js'
      },
      angular: {
        src: 'index_angular.js',
        dest: '<%= buildDir %>/autocomplete.angular.js'
      },
      standalone: {
        src: 'index_standalone.js',
        dest: '<%= buildDir %>/autocomplete.js'
      }
    },

    umd: {
      jquery: {
        src: '<%= buildDir %>/autocomplete.jquery.js',
        deps: {
          default: ['$'],
          amd: ['jquery'],
          cjs: ['jquery'],
          global: ['jQuery']
        }
      },
      angular: {
        src: '<%= buildDir %>/autocomplete.angular.js',
        deps: {
          default: ['angular'],
          amd: ['angular'],
          cjs: ['angular'],
          global: ['angular']
        }
      },
      jquery_min: {
        src: '<%= buildDir %>/autocomplete.jquery.min.js',
        deps: {
          default: ['$'],
          amd: ['jquery'],
          cjs: ['jquery'],
          global: ['jQuery']
        }
      },
      angular_min: {
        src: '<%= buildDir %>/autocomplete.angular.min.js',
        deps: {
          default: ['angular'],
          amd: ['angular'],
          cjs: ['angular'],
          global: ['angular']
        }
      }
    },

    sed: {
      version: {
        pattern: '%VERSION%',
        replacement: '<%= version %>',
        recursive: true,
        path: '<%= buildDir %>'
      }
    },

    eslint: {
      options: {
        config: '.eslintrc'
      },
      src: ['src/**/*.js', 'Gruntfile.js']
    },

    watch: {
      js: {
        files: 'src/**/*.js',
        tasks: 'build'
      }
    },

    clean: {
      dist: 'dist'
    },

    connect: {
      server: {
        options: {port: 8888, keepalive: true}
      }
    },

    concurrent: {
      options: {logConcurrentOutput: true},
      dev: ['server', 'watch']
    },

    step: {
      options: {
        option: false
      }
    }
  });

  // aliases
  // -------

  grunt.registerTask('default', 'build');
  grunt.registerTask('build', ['browserify', 'sed:version', 'umd', 'uglify', 'usebanner']);
  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('lint', 'eslint');
  grunt.registerTask('dev', 'concurrent:dev');

  // load tasks
  // ----------

  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-step');
  grunt.loadNpmTasks('grunt-umd');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('gruntify-eslint');
  grunt.loadNpmTasks('grunt-browserify');
};
