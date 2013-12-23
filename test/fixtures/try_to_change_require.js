var assert = require('assert');

module.require = function (path) {
  console.log('new require: %s', path);
};

var fs = require('fs');
var foo = require('./foo');

for (var k in require.cache) {
  delete require.cache[k];
}
assert.strictEqual(fs, require('fs'));
assert.notStrictEqual(foo, require('./foo'));

module.constructor._resolveFilename = function () {
  throw new Error('hook _resolveFilename error');
};

require('../../lib/module');
