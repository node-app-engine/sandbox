/**!
 * nae-sandbox - lib/sandbox.js
 *
 * Copyright(c) nae team and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var debug = require('debug')('nae:sandbox');
var path = require('path');
var fs = require('fs');
var mod = require('./module');

/**
 * Create a sandbox with options.
 *
 * @param {String} rootdir main runable script root dir.
 * @param {Object} options @see `SandboxModule.config(options)`
 */
function SandBox(rootdir, options) {
  options.limitRoot = rootdir;
  mod.config(options);

  this._rootdir = rootdir;
}

SandBox.prototype.start = function () {
  var pkgfile = path.join(this._rootdir, 'package.json');
  var mainfile = 'index.js';
  if (fs.existsSync(pkgfile)) {
    mainfile = require(pkgfile).main || mainfile;
  }
  mainfile = path.join(this._rootdir, mainfile);
  debug('bootstrap %s', mainfile);
  mod.runMain(mainfile);
};

module.exports = SandBox;
