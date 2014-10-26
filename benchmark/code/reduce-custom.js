'use strict';

/**
 * Reduce
 */

function reduce(acc, fn, init) {
  var len = acc.length;

  for (var i = 0; i < len; i++) {
    init = fn.call(null, init, acc[i], i, acc);
  }

  return init;
}

module.exports = function get(o, path) {
  return reduce(path.split('.'), function(prev, curr) {
    return prev && prev[curr];
  }, o);
};

// console.log(fn.apply(null, [{a: {b: {c: {d: {e: {f: {g: 'THE END!'}}}}}}}, 'a.b.c.d.e.f.g']));