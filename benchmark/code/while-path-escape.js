'use strict';

/**
 * While loop with param for custom function. A noop
 * is called in the benchmarks since a callback isn't passed.
 */

var isObject = require('isobject');

module.exports = function getValue(o, prop) {
  if (o == null || !isObject(o)) {
    return {};
  }
  if (prop == null) {
    return o;
  }

  prop = prop.replace(/\\\./g, '___DOT___');
  var path = prop.split('.').map(function (seg) {
    return seg.replace(/___DOT___/g, '.');
  });

  var last = path.pop();
  var len = path.length;

  for (var i = 0; i < len; i++) {
    var key = path[i];
    o = o[key];
    if (o == null) {
      return {};
    }
  }
  return o[last];
};

