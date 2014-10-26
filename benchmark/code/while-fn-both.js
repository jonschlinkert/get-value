'use strict';

/**
 * While loop
 */

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
      return {};
    }
    if (typeof last === 'object') {
      obj = last;
    }
    i++;
  }
  return last;
};

function replaceStr(str, token, replacement) {
  var i = str.indexOf(token);
  var end = i + token.length;
  str = str.substr(0, i) + replacement + str.substr(end, str.length);
  if (str.indexOf(token, end) !== -1) {
    str = replace(str, token, replacement);
  }
  return str;
}