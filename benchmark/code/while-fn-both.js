
const isObject = require('isobject');

module.exports = function getValue(obj, str, fn) {
  if (obj == null || !isObject(obj)) {
    return {};
  }

  if (str == null || typeof str !== 'string') {
    return obj;
  }

  let path;

  if (fn && typeof fn === 'function') {
    path = fn(str);
  } else if (fn === true) {
    str = replaceStr(str, '\\.', '___DOT___');
    path = str.split('.').map(function(seg) {
      return replaceStr(seg, '___DOT___', '.');
    });
  } else {
    path = str.split('.');
  }

  const len = path.length;
  let i = 0;
  let last;

  while (i < len) {
    const key = path[i];
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
  const i = str.indexOf(token);
  const end = i + token.length;
  str = str.substr(0, i) + replacement + str.substr(end, str.length);
  if (str.indexOf(token, end) !== -1) {
    str = str.replace(token, replacement);
  }
  return str;
}
