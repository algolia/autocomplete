var semver = require('semver'),
    f = require('util').format,
    files = {
      common: [
      'src/common/utils.js'
      ],
      typeahead: [
      'src/typeahead/html.js',
      'src/typeahead/css.js',
      'src/typeahead/event_bus.js',
      'src/typeahead/event_emitter.js',
      'src/typeahead/highlight.js',
      'src/typeahead/input.js',
      'src/typeahead/dataset.js',
      'src/typeahead/dropdown.js',
      'src/typeahead/typeahead.js',
      'src/typeahead/plugin.js'
      ]
    };

module.exports = function(grunt) {
  grunt.initConfig({
    version: grunt.file.readJSON('package.json').version,

    buildDir: 'dist',

    banner: [
      '/*!',
      ' * typeahead.js <%= version %>',
      ' * https://github.com/twitter/typeahead.js',
      ' * Copyright 2013-<%= grunt.template.today("yyyy") %> Twitter, Inc. and other contributors; Licensed MIT',
      ' */\n\n'
    ].join('\n'),

    uglify: {
      options: {
        banner: '<%= banner %>',
        enclose: { 'window.jQuery': '$' }
      },
      typeahead: {
        options: {
          mangle: false,
          beautify: true,
          compress: false
        },
        src: files.common.concat(files.typeahead),
        dest: '<%= buildDir %>/typeahead.jquery.js'

      },
      typeaheadMin: {
        options: {
          mangle: true,
          compress: true
        },
        src: files.common.concat(files.typeahead),
        dest: '<%= buildDir %>/typeahead.jquery.min.js'

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

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      src: 'src/**/*.js',
      gruntfile: ['Gruntfile.js']
    },

    watch: {
      js: {
        files: 'src/**/*',
        tasks: 'build'
      }
    },

    clean: {
      dist: 'dist'
    },

    connect: {
      server: {
        options: { port: 8888, keepalive: true }
      }
    },

    concurrent: {
      options: { logConcurrentOutput: true },
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
  grunt.registerTask('build', ['uglify', 'sed:version']);
  grunt.registerTask('server', 'connect:server');
  grunt.registerTask('lint', 'jshint');
  grunt.registerTask('dev', 'concurrent:dev');

  // load tasks
  // ----------

  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-step');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
};
