
'use strict';

var grunt = require('grunt');

exports.develop = {

  fixtures: function(test) {
    test.expect(1);
    test.ok(!grunt.file.exists('fixtures/app.js'), 'app.js fixture should exist');
    test.ok(!grunt.file.exists('fixtures/app.coffee'), 'app.coffee fixture should exist');
    test.done();
  },

};
