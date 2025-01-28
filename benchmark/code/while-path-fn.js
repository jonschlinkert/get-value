
const isObject = require('isobject');

module.exports = function getValue(o, prop, cb) {
  if (o == null || !isObject(o)) {
    return {};
  }
  if (prop == null) {
    return o;
  }

  cb = typeof cb === 'function' ? cb : function(str) {
    return str.split('.');
  };

  const path = cb(prop);
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

