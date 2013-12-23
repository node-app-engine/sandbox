/*!
 * nae-sandbox - demo_userscript.js
 *
 * Copyright(c) 2013 fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 * MIT Licensed
 */

"use strict";

/**
 * Module dependencies.
 */

var fs = require('fs');

console.log(module)
console.log(process.memoryUsage(), __filename, __dirname);
// console.log(global, this)

// require.resolve = 'bar';
console.log('hello world from user land');

exports.module = module;