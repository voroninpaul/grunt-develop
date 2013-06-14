
/*!
 *
 * grunt-develop
 * http://github.com/edwardhotchkiss/grunt-develop
 *
 * Copyright (c) 2013 Edward Hotchkiss
 * Licensed under the MIT license.
 *
 */

'use strict';

module.exports = function(grunt) {

  var child
    , fs = require('fs')
    , util = require('util')
    , child_process = require('child_process');

  var exited = true;

  // kill child process (server)
  grunt.event.on('develop.kill', function(filename) {
    grunt.log.warn('\nkill process');
    child.kill('SIGHUP');
  });

  // watches server and broadcasts restart on change
  grunt.event.on('develop.watch', function(filename) {
    fs.watchFile(filename, { interval: 250 }, function(change) {
      grunt.log.warn('\nfile changed');
      grunt.event.emit('develop.kill');
    });
  });

  // starts server
  grunt.event.on('develop.start', function(filename) {
    if (!exited) {
      return grunt.event.emit('develop.kill', filename);
    }
    child = child_process.spawn(process.argv[0], [filename], {
      stdio: 'inherit'
    });
    exited = false
    grunt.log.ok(util.format('started application "%s".', filename));
    child.on('exit', function(code, signal) {
      exited = true;
      if (signal !== null) {
        grunt.log.warn(util.format('application exited with signal %s',
          signal));
        if (signal === 'SIGHUP')
          grunt.event.emit('develop.start', filename);
        return;
      }
      grunt.log.warn(util.format('application exited with code %s', code));
    });
    grunt.event.emit('develop.watch', filename);
  });

  // TASK. perform setup
  grunt.registerMultiTask('develop', 'init', function() {
    var done, filename = this.data.file;
    if (!grunt.file.exists(filename)) {
      grunt.fail.warn(util.format('application file "%s" not found!', filename));
      return false;
    }
    done = this.async();
    grunt.event.emit('develop.start', filename);
    done();
  });

};

/* EOF */