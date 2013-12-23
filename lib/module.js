/*!
 * nae-sandbox - module.js
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

var debug = require('debug')('nae:sandbox_module');
var util = require('util');
var Module = require('module').Module;
var path = require('path');
var runInThisContext = require('vm').runInThisContext;
var runInNewContext = require('vm').runInNewContext;
var assert = require('assert').ok;

var _disableModules = {};
var _nativeModules = {};
var _enableAddons = false;
var _limitRootDir = '/';

function SandboxModule(id, parent) {
  Module.call(this, id, parent);
}

util.inherits(SandboxModule, Module);

var _nativeNames = [
  'fs', 'path', 'os', 'tty',
  'readline', 'stream', 'events',
  'net', 'http', 'https', 'domain', 'dns', 'dgram',
  'zlib', 'tls', 'crypto', 'buffer',
  'util', 'assert', 'querystring',
  'string_decoder',
  'url',
];

function initConfig() {
  _disableModules = {};
  _nativeModules = {};
  for (var i = 0; i < _nativeNames.length; i++) {
    var name = _nativeNames[i];
    _nativeModules[name] = require(name);
  }
  _enableAddons = false;
  _limitRootDir = '/';
}

/**
 * Config Sandbox modules
 *
 * @param {Object} [options]
 *  - {Array} [disableModules] disable module names, e.g.: `['child_process', 'repl']`
 *  - {Object} modules configurable modules, e.g.: `{fs: fs2, net: net2}`
 *  - {String} limitRoot limit app root dir, e.g.: `/home/apps/foo`
 */
SandboxModule.config = function (options) {
  initConfig();

  options = options || {};
  if (options.disableModules && options.disableModules.length) {
    for (var i = 0; i < options.disableModules.length; i++) {
      _disableModules[options.disableModules[i]] = true;
    }
  }
  if (options.modules) {
    for (var k in options.modules) {
      _nativeModules[k] = options.modules[k];
    }
  }
  _enableAddons = options.enableAddons === true;
  _limitRootDir = options.limitRoot || '/';
  // make sure limit root dir end withs '/'
  _limitRootDir = _limitRootDir.replace(/\/+$/g, '') + '/';
};

SandboxModule._cache = {};
SandboxModule._resolveLookupPaths = Module._resolveLookupPaths;
SandboxModule._findPath = Module._findPath;

SandboxModule._resolveFilename = function (request, parent) {
  debug('SandboxModule._resolveFilename %s parent: %s', request, parent && parent.id);
  if (_disableModules.hasOwnProperty(request)) {
    var err = new Error("Disable module '" + request + "'");
    err.code = 'MODULE_DISABLE';
    throw err;
  }

  if (_nativeModules.hasOwnProperty(request)) {
    return request;
  }

  var resolvedModule = SandboxModule._resolveLookupPaths(request, parent);
  var id = resolvedModule[0];
  var paths = resolvedModule[1];

  var limitPaths = [];
  for (var i = 0; i < paths.length; i++) {
    var basePath = path.resolve(paths[i], request);
    if (basePath.indexOf(_limitRootDir) === 0) {
      limitPaths.push(paths[i]);
    }
  }

  // look up the filename first, since that's the cache key.
  debug('SandboxModule._resolveFilename looking for %j in %j, orgin paths: %j',
    request, limitPaths, paths);

  var filename = SandboxModule._findPath(request, limitPaths);
  if (!filename) {
    var err = new Error("Cannot find module '" + request + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  }
  return filename;
};

SandboxModule._load = function (request, parent, isMain) {
  debug('SandboxModule._load %s parent: %s', request, parent && parent.id);

  var filename = SandboxModule._resolveFilename(request, parent);

  var cachedModule = SandboxModule._cache[filename];
  if (cachedModule) {
    debug('SandboxModule._load cache module %s', request);
    return cachedModule.exports;
  }

  if (_nativeModules.hasOwnProperty(filename)) {
    debug('SandboxModule._load native module %s', request);
    return _nativeModules[filename];
  }

  var module = new SandboxModule(filename, parent);

  if (isMain) {
    process.mainModule = module;
    module.id = '.';
  }

  SandboxModule._cache[filename] = module;

  var hadException = true;

  try {
    module.load(filename);
    hadException = false;
  } finally {
    if (hadException) {
      delete SandboxModule._cache[filename];
    }
  }

  return module.exports;
};

SandboxModule.prototype.require = function (path) {
  assert(util.isString(path), 'path must be a string');
  assert(path, 'missing path');
  return SandboxModule._load(path, this);
};

SandboxModule.prototype._compile = function (content, filename) {
  var self = this;
  // remove shebang
  content = content.replace(/^\#\!.*/, '');

  function require(path) {
    return self.require(path);
  }

  require.resolve = function(request) {
    return SandboxModule._resolveFilename(request, self);
  };

  Object.defineProperty(require, 'paths', { get: function() {
    throw new Error('require.paths is removed. Use ' +
                    'node_modules folders, or the NODE_PATH ' +
                    'environment variable instead.');
  }});

  require.main = process.mainModule;

  // Enable support to add extra extension types
  require.extensions = SandboxModule._extensions;
  require.registerExtension = function() {
    throw new Error('require.registerExtension() removed. Use ' +
                    'require.extensions instead.');
  };

  require.cache = SandboxModule._cache;

  var dirname = path.dirname(filename);

  SandboxModule._contextLoad = true;
  if (SandboxModule._contextLoad) {
    debug('self._compile() %s', self.id);
    if (self.id !== '.') {
      debug('self._compile() submodule %s', self.id);
      // not root module
      var sandbox = {};
      for (var k in global) {
        sandbox[k] = global[k];
      }
      sandbox.require = require;
      sandbox.exports = self.exports;
      sandbox.__filename = filename;
      sandbox.__dirname = dirname;
      sandbox.module = self;
      sandbox.global = sandbox;
      sandbox.root = root;

      return runInNewContext(content, sandbox, { filename: filename });
    }

    debug('self._compile() root module');
    // root module
    global.require = require;
    global.exports = self.exports;
    global.__filename = filename;
    global.__dirname = dirname;
    global.module = self;

    return runInThisContext(content, { filename: filename });
  }
};

module.exports = SandboxModule;
