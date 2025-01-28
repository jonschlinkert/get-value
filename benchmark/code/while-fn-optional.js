
const isObject = require('isobject');

module.exports = function getValue(obj, str, fn) {
  if (obj == null || !isObject(obj)) {
    return {};
  }

  if (str == null || typeof str !== 'string') {
    return obj;
  }

  let paths;

  if (fn && typeof fn === 'function') {
    paths = fn(str);
  } else {
    paths = str.split('.');
  }

  const len = paths.length;
  let i = 0;
  let last;

  while (i < len) {
    const key = paths[i];
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
