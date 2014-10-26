'use strict';

/**
 * get-value
 */

var Suite = require('benchmarked');

var suite = new Suite({
  expected: true,
  fixtures: 'fixtures/*.js',
  add: 'code/{while,while-fn-*,reduce*}.js',
  cwd: __dirname
});
suite.run();


// sanity check
// module.exports = function (fn) {
//   // return fn.apply(null, [{x: {y: {z: 'foooo'}}}, 'x.y.z']);
//   // return fn.apply(null, [{'a.b.c': {d: {e: {f: {g: 'THE END!'}}}}}, 'a\\.b\\.c.d.e.f.g']);
// }