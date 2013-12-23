/**!
 * nae-sandbox - test/sandbox.test.js
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var path = require('path');
var SandBox = require('../');

describe('sandbox.test.js', function () {
  describe('start()', function () {
    it('should run a hello world on sandbox', function () {
      var appdir = path.join(path.dirname(__dirname), 'examples', 'helloworld');
      var sb = new SandBox(appdir, {
        disableModules: ['child_process']
      });
      sb.start();
    });
  });
});
