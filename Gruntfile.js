'use strict';

// var mongooseSeed = require('./lib/mongoose-seed');

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverJS: ['Gruntfile.js', 'bin/www', 'app.js', 'config/**/*.js', 'controllers/**/*.js',
      'lib/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'services/**/*.js'],
    mochaTests: ['test/**/*.js']
  };

  var distFiles = ['package.json', 'reporting-api-processes.json', 'app.js', 'bin/www', 'config/**/*.js', 'controllers/**/*.js', 'lib/**/*.js', 'models/**/*.js', 'routes/**/*.js', 'services/**/*.js', 'resources/templates/**/*', 'locales/**/*'];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      local: {
        NODE_ENV: 'local'
      },
      test: {
        NODE_ENV: 'test'
      },
      qa: {
        NODE_ENV: 'qa'
      }
    },
    watch: {
      serverJS: {
        files: watchFiles.serverJS,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },
    jshint: {
      all: {
        src: watchFiles.serverJS,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      local: {
        script: 'bin/www',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js',
          watch: watchFiles.serverJS
        }
      },
      debug: {
        script: 'bin/www',
        options: {
          nodeArgs: ['--inspect'],
          ext: 'js',
          watch: watchFiles.serverJS
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': ['node_modules']
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon:debug', 'watch'],
      prod: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true,
        limit: 10
      }
    },
    mochaTest: {
      default: {
        options: {
          timeout: 20000,
          reporter: 'spec',
          captureFile: 'results.txt'
        },
        src: watchFiles.mochaTests
      },
      ci: {
        options: {
          timeout: 40000,
          bail: true,
          reporter: 'spec',
          captureFile: 'results.txt'
        },
        src: watchFiles.mochaTests
      }
    },
    apidoc: {
      myapp: {
        src: 'routes/',
        dest: 'doc/'
      }
    },
    copy: {
      dist: {
        expand: true,
        src: distFiles,
        dest: 'dist/'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('force', function(set) {
    if (set === 'on') {
      grunt.option('force', true);
    } else if (set === 'off') {
      grunt.option('force', false);
    }
  });

  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-apidoc');

  // Default task(s).
  grunt.registerTask('default', ['force:on', 'env:local', 'hint', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['force:on', 'env:local', 'hint', 'concurrent:debug']);

  // Test task.
  grunt.registerTask('test', ['force:on', 'env:test', 'mochaTest', 'hint']);

  // Test task for CI environments.
  grunt.registerTask('test:ci', ['force:off', 'env:test', 'mochaTest:ci', 'hint']);

  // QA task.
  grunt.registerTask('qa', ['env:qa', 'hint', 'concurrent:default']);

  // Lint task(s).
  grunt.registerTask('hint', ['jshint']);

  // Doc task.
  grunt.registerTask('doc', ['apidoc']);

  // Build task
  grunt.registerTask('build', ['copy:dist']);

  // SeedDB task.
  // grunt.registerTask('seed-db', 'Seed Mongoose DB', function() {
  //   var done = this.async();
  //   mongooseSeed(done);
  // });
};