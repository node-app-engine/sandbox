var fs = require('fs');
console.log('fs load %s', !!fs);
require('./foo');
require('./foo');
var child_process = require('child_process');
console.log(child_process);
