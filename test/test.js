'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var mm = require('micromatch');
var units = require('./units');
var code = path.join.bind(path, __dirname, '../benchmark/code');

var files = (pattern) => {
  return mm(fs.readdirSync(code()), pattern + '{,.js}').map(f => code(f));
};

if (argv.bench) {
  files(argv.bench).forEach(file => units(require(file)));
  return;
}

units(require('..'));
