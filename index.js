/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var isObject = require('isobject');

module.exports = function getValue(obj, str, fn) {
  if (obj == null || !isObject(obj)) {
    return {};
  }

  if (str == null || typeof str !== 'string') {
    return obj;
  }

  var path;

  if (fn && typeof fn === 'function') {
    path = fn(str);
  } else if (fn === true) {
    str = replaceStr(str, '\\.', '___DOT___');
    path = str.split('.').map(function (seg) {
      return replaceStr(seg, '___DOT___', '.');
    });
  } else {
    path = str.split('.');
  }

  var len = path.length;
  var i = 0;
  var last;

  while(i < len) {
    var key = path[i];
    last = obj[key];
    if (last == null) {
      return null;
    }
    if (typeof last === 'object') {
      obj = last;
    }
    i++;
  }
  return last;
};

function replaceStr(str, pattern, replacement) {
  var i = str.indexOf(pattern);
  var end = i + pattern.length;
  str = str.substr(0, i) + replacement + str.substr(end, str.length);
  if (str.indexOf(pattern, end) !== -1) {
    str = replace(str, pattern, replacement);
  }
  return str;
}