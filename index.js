/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var noncharacters = require('noncharacters');
var isObject = require('isobject');

module.exports = function getValue(obj, str, fn) {
  if (!isObject(obj)) return {};
  if (typeof str !== 'string') return obj;

  var path;

  if (fn && typeof fn === 'function') {
    path = fn(str);
  } else if (fn === true) {
    path = escapePath(str);
  } else {
    path = str.split('.');
  }

  var len = path.length, i = 0;
  var last = null;

  while(len--) {
    last = obj[path[i++]];
    if (!last) { return last; }

    if (typeof last === 'object') {
      obj = last;
    }
  }
  return last;
};


function escape(str) {
  return str.split('\\.').join(noncharacters[0]);
}

function unescape(str) {
  return str.split(noncharacters[0]).join('.');
}

function escapePath(str) {
  return escape(str).split('.').map(function (seg) {
    return unescape(seg);
  });
}
