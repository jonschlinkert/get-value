/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014 Jon Schlinkert, contributors.
 * Licensed under the MIT License
 */

'use strict';

var isObject = require('isobject');

module.exports = function getValue(o, prop) {
  if (o == null) return {};
  if (o && !isObject(o)) return {};
  if (prop == null) return o;

  var path = prop.split('.');
  var last = path.pop();
  var len = path.length;

  for (var i = 0; i < len; i++) {
    var key = path[i];
    o = o[key];
    if (o == null) {
      return null;
    }
  }
  return o[last];
};