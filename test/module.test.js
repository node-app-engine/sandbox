/**!
 * nae-sandbox - test/module.test.js
 *
 * Copyright(c) 2013 Alibaba Group Holding Limited.
 * Authors:
 *   苏千 <suqian.yf@taobao.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var path = require('path');
var mm = require('mm');
var Module = require('../lib/module');

var fixtures = path.join(__dirname, 'fixtures');

describe('module.test.js', function () {
  describe('module.load()', function () {
    it('should throw request disable module', function () {
      Module.config({
        disableModules: ['child_process'],
        limitRoot: __dirname,
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'require_disable_module.js'));
      }).should.throw("Disable module 'child_process'");
    });

    it('should configaurable addons', function () {
      Module.config({
        disableModules: ['child_process'],
        limitRoot: path.dirname(__dirname),
        enableAddons: true,
      });
      var mod = new Module('.');
      mod.load(path.join(fixtures, 'require_addon.js'));

      Module.config({
        disableModules: ['child_process'],
        limitRoot: path.dirname(__dirname),
        enableAddons: false,
      });
      mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'require_addon.js'));
      }).should.throw(/Disable addons module .+\/microtime\.node\'$/);
    });

    it('should throw request outoff the limitRoot dir file', function () {
      Module.config({
        limitRoot: __dirname + '////////////////',
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'limit_root.js'));
      }).should.throw("Cannot find module '../../lib/module'");
    });
  });
});
