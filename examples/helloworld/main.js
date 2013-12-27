/*!
 * nae-sandbox - examples/helloworld/main.js
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

var fs = require('fs');

console.log('hello world, file size: %d', fs.readFileSync(__filename).length);

try {
  fs.readFileSync('/home/someone/foo.txt');
} catch (e) {
  console.log('read file error: %s', e);
}

try {
  require('nae-fs');
} catch (e) {
  console.log('require nae-fs error: %s', e);
}

try {
  require('../foo');
} catch (e) {
  console.log('require foo: %s', e);
}

try {
  require('child_process');
} catch (e) {
  console.log('require child_process: %s', e);
}
