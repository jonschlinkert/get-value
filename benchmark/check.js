'use strict';

var path = require('path');
var bold = require('ansi-bold');
var glob = require('matched');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {fixtures: 'f', code: 'c'}
});

/**
 * Sanity check. Run to ensure that all fns return the same result.
 */

var fixtures = files('fixtures', argv.f);
var code = files('code', argv.c);

code.forEach(function (fp) {
  var fn = require(path.resolve(__dirname, 'code', fp));
  var name = path.basename(fp, path.extname(fp));

  fixtures.forEach(function (fixture) {
    var base = ' (' + path.basename(fixture, path.extname(fixture)) + ')';
    console.log(bold(name) + ':' + base, fn.apply(fn, require(fixture)));
  });
});


function toGlob(base, pattern) {
  return path.join(__dirname, base, (pattern || '*') + '.js');
}

function files(base, pattern) {
  return glob.sync(toGlob(base, pattern));
}
