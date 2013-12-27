nae-sandbox
=======

[![Build Status](https://secure.travis-ci.org/node-app-engine/sandbox.png)](http://travis-ci.org/node-app-engine/sandbox) [![Coverage Status](https://coveralls.io/repos/node-app-engine/sandbox/badge.png)](https://coveralls.io/r/node-app-engine/sandbox) [![Dependency Status](https://gemnasium.com/node-app-engine/sandbox.png)](https://gemnasium.com/node-app-engine/sandbox)

[![NPM](https://nodei.co/npm/nae-sandbox.png?downloads=true&stars=true)](https://nodei.co/npm/nae-sandbox/)

![logo](https://raw.github.com/node-app-engine/sandbox/master/logo.png)

Sandbox env for Node App Engine.

## Safe env

* Control `fs` module, only read app scope file resouces: `nae-fs` module
* Disable `child_process` module
* Configurable `Control modules`, e.g.: `net`, `http`
* Configurable `C/C++ Addons`: `options.enableAddons = ture / false`

## Module load flow

* `SafeModule._load(request, parent, isMain)`
* `SafeModule._resolveFilename(request, parent)`: check current user app permissions

Only allows:

```
/app/*.(js|json)
/app/node_modules/*
```

## SandBox Start Flows

* SandBox manager create a sandbox child process: `sp`
* `sp` use `SandboxModule` load `app` main file, so `app` run in the sandbox safe env.

`app` code can not rewrite the sandbox codes.

## From

* `module.js` base on [node/v0.11.9/lib/module.js](https://raw.github.com/joyent/node/v0.11.9/lib/module.js)

## Module load flows

* Create root module in a sandbox: id: `"."`
* root_module.load()
* Module._extensions['.js'] => `root_module._compile()`

## Install

```bash
$ npm install nae-sandbox
```

## Usage

### Start a Sandbox

```js
var SandBox = require('nae-sandbox');
var naefs = require('nae-fs');

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
```

### Examples

@see [examples/](https://github.com/node-app-engine/sandbox/tree/master/examples)

* [helloworld](https://github.com/node-app-engine/sandbox/tree/master/examples/helloworld)
* [connect](https://github.com/node-app-engine/sandbox/tree/master/examples/connect)

## Authors

```bash
$ git summary

 project  : nae-sandbox
 repo age : 6 days
 active   : 4 days
 commits  : 11
 files    : 31
 authors  :
    10  fengmk2                 90.9%
     1  dead_horse              9.1%
```

## License

(The MIT License)

Copyright(c) nae team and other contributors.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
