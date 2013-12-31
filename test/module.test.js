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
var sm = require('../lib/module');
var Module = sm.SandboxModule;

var fixtures = path.join(__dirname, 'fixtures');

describe('module.test.js', function () {
  describe('module.load()', function () {
    it('should throw request disable module', function () {
      sm.config({
        disableModules: ['child_process'],
        limitRoot: __dirname,
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'require_disable_module.js'));
      }).should.throw("Disable module 'child_process'");
    });

    it('should disable addons: require("./addons")', function () {
      sm.config({
        disableModules: ['child_process'],
        limitRoot: path.dirname(__dirname),
        enableAddons: false,
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'require_addon.js'));
      }).should.throw("Disable addons module './addons'");
    });

    it('should disable addons: require("./addons.node")', function () {
      sm.config({
        disableModules: ['child_process'],
        limitRoot: path.dirname(__dirname),
        enableAddons: false,
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'require_addon_2.js'));
      }).should.throw("Disable addons module './addons.node'");
    });

    it('should throw request outoff the limitRoot dir file', function () {
      sm.config({
        limitRoot: __dirname + '////////////////',
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'limit_root.js'));
      }).should.throw("Cannot find module '../../lib/module'");
    });

    it('should extend globals works fine', function (done) {
      sm.config({
        'globals' : {
          'foo' : function () {
            should.ok(true);
            done();
          },
        }
      });
      (new Module('.')).load(path.join(fixtures, 'extend_globals.js'));
    });
  });

  describe('securty hook', function () {
    it('should not rewrite require method', function () {
      sm.config({
        limitRoot: __dirname,
      });
      var mod = new Module('.');
      (function () {
        mod.load(path.join(fixtures, 'try_to_change_require.js'));
      }).should.throw("Cannot find module '../../lib/module'");
    });
  });

});
