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

  let segs = isArray ? path : path.split(/\\?\./);
  let obj = target;

  while ((isObject(obj) || Array.isArray(obj)) && segs.length) {
    if (segs[0] in obj) {
      obj = obj[segs.shift()];
      continue;
    }

    const rest = segs.slice();
    let hasProp = false;

    do {
      const prop = rest.join('.');

      if ((hasProp = prop in obj)) {
        segs = segs.slice(rest.length);
        obj = obj[prop];
        break;
      }

      rest.pop();
    } while (rest.length);

    if (!hasProp) {
      return;
    }
  }

  return obj;
};
