const isObject = require('isobject');

module.exports = function getValue(o, prop) {
  if (o == null || !isObject(o)) {
    return {};
  }

  if (prop == null || typeof prop !== 'string') {
    return o;
  }

  let path;

  if (prop.indexOf('\\.') !== -1) {
    prop = replaceStr(prop, '\\.', '___DOT___');

    path = prop.split('.').map(function(seg) {
      return replaceStr(seg, '___DOT___', '.');
    });
  } else {
    path = prop.split('.');
  }

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

function replaceStr(str, pattern, replacement) {
  let i; let from = 0;
  while (str.indexOf(pattern, from) !== -1) {
    i = str.indexOf(pattern, from);
    from = i + pattern.length;
    str = str.substr(0, i)
      + replacement
      + str.substr(from, str.length);
    from = i + replacement.length;
  }
  return str;
}
