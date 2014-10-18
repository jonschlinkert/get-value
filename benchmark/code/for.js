'use strict';

/**
 * For loop
 */

var isObject = require('isobject');

module.exports = function getValue(o, prop) {
  if (o == null || !isObject(o)) {
    return {};
  }

  if (prop == null || typeof prop !== 'string') {
    return o;
  }

  var path = prop.split('.');
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
