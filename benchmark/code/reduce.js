'use strict';

/**
 * Reduce
 */

module.exports = function get(o, path) {
  return path.split('.').reduce(function(prev, curr) {
    return prev && prev[curr];
  }, o);
};

// console.log(fn.apply(null, [{a: {b: {c: {d: {e: {f: {g: 'THE END!'}}}}}}}, 'a.b.c.d.e.f.g']));