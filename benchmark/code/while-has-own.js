
const isObject = require('isobject');

module.exports = function getValue(obj, str) {
  if (obj == null || !isObject(obj)) {
    return {};
  }

  if (str == null || typeof str !== 'string') {
    return obj;
  }

  const paths = str.split('.');
  const len = paths.length;
  let i = 0;
  let last;

  while (i < len) {
    const key = paths[i];
    if (obj.hasOwnProperty(key)) {
      last = obj[key];
      if (typeof last === 'object') {
        obj = last;
      }
    }
    i++;
  }
  return last;
};
