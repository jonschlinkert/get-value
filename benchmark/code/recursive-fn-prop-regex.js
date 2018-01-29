const isObject = require('isobject');
const isEnumerable = Object.prototype.propertyIsEnumerable;

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

  let segs = Array.isArray(path) ? path : path.split(/\\?\./);
  let obj = target;

  function lookup() {
    if ((isObject(obj) || Array.isArray(obj)) && segs.length) {
      let prop = segs[0];

      if (isEnumerable.call(obj, prop)) {
        obj = obj[segs.shift()];
        return lookup();
      }

      let rest = segs.slice();

      do {
        prop = rest.join('.');

        if (isEnumerable.call(obj, prop)) {
          segs = segs.slice(rest.length);
          obj = obj[prop];
          return lookup();
        }

        rest.pop();
      } while (rest.length);

      return;
    }

    return obj;
  }

  return lookup();
};
