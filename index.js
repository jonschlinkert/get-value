/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

module.exports = function(obj, prop) {
  if (!isObject(obj)) { return obj; }
  var segs = toSegments(prop);
  if (segs === null) return obj;

  var len = segs.length;
  var i = -1;

  while (obj && (++i < len)) {
    var key = segs[i];
    while (key[key.length - 1] === '\\') {
      key = key.slice(0, -1) + '.' + segs[++i];
    }
    obj = obj[key];
  }
  return obj;
};

function toSegments(val) {
  if (Array.isArray(val)) {
    return val;
  }
  if (typeof val === 'string') {
    return val.split('.');
  }
  return null;
}

function isObject(val) {
  return val !== null && (typeof val === 'object' || typeof val === 'function');
}

