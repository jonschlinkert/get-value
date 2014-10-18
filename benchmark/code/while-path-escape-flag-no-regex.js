'use strict';

/**
 * While loop with param for custom function. A noop
 * is called in the benchmarks since a callback isn't passed.
 */

var isObject = require('isobject');

module.exports = function getValue(o, prop, escape) {
  if (o == null || !isObject(o)) {
    return {};
  }
  if (prop == null) {
    return o;
  }

  var path;

  if (escape === true) {
    prop = replaceStr(prop, '\\.', '___DOT___');
    path = prop.split('.').map(function (seg) {
      return replaceStr(seg, '___DOT___', '.');
    });
  } else {
    path = prop.split('.');
  }

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

function replaceStr(str, pattern, replacement) {
  var i, from = 0;
  while (str.indexOf(pattern, from) !== -1) {
    i = str.indexOf(pattern, from);
    from = i + pattern.length;
    str = str.substr(0, i)
      + replacement
      + str.substr(from, str.length);
    from = i + replacement.length;
  }
  return str;
}