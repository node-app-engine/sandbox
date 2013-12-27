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
var http = require('http');
var naefs = require('nae-fs');
var SandBox = require('../');

describe('sandbox.test.js', function () {
  describe('start()', function () {
    it('should run a hello world on sandbox', function () {
      var appdir = path.join(path.dirname(__dirname), 'examples', 'helloworld');
      var sb = new SandBox(appdir, {
        disableModules: ['child_process'],
        modules: {
          fs: naefs.create({
            pwd: appdir,
            limitRoot: appdir,
          }),
        }
      });
      sb.start();
    });

    it('should run a http server', function (done) {
      var appdir = path.join(path.dirname(__dirname), 'examples', 'connect');
      var sb = new SandBox(appdir, {
        disableModules: ['child_process']
      });
      sb.start();
      setTimeout(function () {
        http.get('http://127.0.0.1:3000', function (res) {
          res.should.status(200);
          res.on('data', function (data) {
            data.toString().should.equal('Hello from Connect!\n');
          });
          res.on('end', function () {
            done();
          });
        });
      }, 100);
    });
  });
});
