/*!
 * nae-sandbox - demo.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');
var path = require('path');
var vm = require('vm');

// Object.freeze(require)

var safeProcess = {
  memoryUsage: process.memoryUsage.bind(process)
};

function safeCompileFile(filepath) {
  var usercode = fs.readFileSync(filepath, 'utf8');
  var parent = {
    id: '.',
    exports: {},
    parent: null,
    filename: __filename,
    loaded: false,
    children: [],
    paths: [], // node_modules paths
  };
  var mod = {
    id: filepath,
    exports: {},
    parent: parent,
    filename: filepath,
    loaded: false,
    children: [],
    paths: []
  };
  var global = {
    console: console,
    require: require,
    process: safeProcess,
    __filename: filepath,
    __dirname: path.dirname(filepath),
    global: {
      Buffer: Buffer
    },
    module: mod,
    exports: mod.exports,
  };
  vm.runInNewContext(usercode, global, filepath);
}

console.log(this, module, module.exports === exports);

// var userMod = require('./demo_userscript');
// console.log(userMod)
safeCompileFile(path.join(__dirname, 'demo_userscript.js'));

// console.log(require.resolve)
