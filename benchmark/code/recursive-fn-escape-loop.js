const isObject = require('isobject');

module.exports = function(target, path) {
  if (!isObject(target) && !Array.isArray(target)) {
    return target;
  }

  const isArray = Array.isArray(path);
  const isString = typeof path === 'string';

  if (!isString && !isArray) {
    return target;
  }

  if (isString && path in target) {
    return target[path];
  }

  let segs = Array.isArray(path) ? path : path.split('.');
  let obj = target;

  function lookup() {
    if ((isObject(obj) || Array.isArray(obj)) && segs.length) {
      let prop = segs[0];

      while (prop.slice(-1) === '\\') {
        prop = prop.slice(0, -1) + '.' + segs[1];
        segs.shift();
        segs[0] = prop;
      }

      if (prop in obj) {
        obj = obj[segs.shift()];
        return lookup();
      }

      let rest = segs.slice();

      do {
        prop = rest.join('.');

        if (prop in obj) {
          segs = segs.slice(rest.length);
          obj = obj[prop];
          return lookup();
        }

      } while (rest.pop());

      return;
    }

    return obj;
  }

  return lookup();
};
