
const isObject = require('isobject');

module.exports = function getValue(o, prop) {
  if (o == null || !isObject(o)) {
    return {};
  }
  if (prop == null) {
    return o;
  }

  prop = prop.replace(/\\\./g, '___DOT___');
  const path = prop.split('.').map(function(seg) {
    return seg.replace(/___DOT___/g, '.');
  });

  const last = path.pop();
  const len = path.length;

  for (let i = 0; i < len; i++) {
    const key = path[i];
    o = o[key];
    if (o == null) {
      return {};
    }
  }
  return o[last];
};

