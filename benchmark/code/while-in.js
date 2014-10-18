'use strict';

/**
 * While loop
 */

var isObject = require('isobject');

module.exports = function getValue(obj, str) {
  if (obj == null || !isObject(obj)) {
    return {};
  }

  if (str == null || typeof str !== 'string') {
    return obj;
  }

  var paths = str.split('.');
  var len = paths.length;
  var i = 0;
  var last;

  while(i < len) {
    var key = paths[i];
    if (key in obj) {
      last = obj[key];
      if (typeof last === 'object') {
        obj = last;
      }
    }
    i++;
  }
  return last;
};
