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
    str = str.split('\\.').join(noncharacters[0]);
    path = str.split('.').map(function (seg) {
      return seg.split(noncharacters[0]).join('.');
    });
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