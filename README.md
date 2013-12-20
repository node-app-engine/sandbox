nae-sandbox
=======

[![Build Status](https://secure.travis-ci.org/fengmk2/nae-sandbox.png)](http://travis-ci.org/fengmk2/nae-sandbox) [![Coverage Status](https://coveralls.io/repos/fengmk2/nae-sandbox/badge.png)](https://coveralls.io/r/fengmk2/nae-sandbox) [![Dependency Status](https://gemnasium.com/fengmk2/nae-sandbox.png)](https://gemnasium.com/fengmk2/nae-sandbox)

[![NPM](https://nodei.co/npm/nae-sandbox.png?downloads=true&stars=true)](https://nodei.co/npm/nae-sandbox/)

![logo](https://raw.github.com/fengmk2/nae-sandbox/master/logo.png)

Sandbox env for Node App Engine.

## Safe env

* Control `fs` module, only read app scope file resouces
* Disable `child_process` module
* Configurable `Control modules`, e.g.: `net`, `http`
* Configurable `C/C++ Addons`

## Module load flow

* `SafeModule._load(request, parent, isMain)`
* `SafeModule._resolveFilename(request, parent)`: check current user app permissions

Only allows:

```
/app/*.(js|json)
/app/node_modules/*
```



## Install

```bash
$ npm install nae-sandbox
```

## Usage

```js
var nae-sandbox = require('nae-sandbox');

nae-sandbox.foo(function (err) {

});
```

## License

(The MIT License)

Copyright (c) 2013 fengmk2 &lt;fengmk2@gmail.com&gt;

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
