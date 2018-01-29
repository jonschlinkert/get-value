const isObject = require('isobject');

module.exports = function(target, path, escape) {
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
  let idx = 0;

  do {
    let seg = segs[idx];

    if (seg in obj) {
      obj = obj[seg];
      continue;
    }

    let rest = segs.slice();
    let hasProp = false;

    do {
      const prop = rest.join('.');

      if ((hasProp = (prop in obj))) {
        segs = segs.slice(rest.length);
        obj = obj[prop];
        --idx;
        break;
      }

      rest.pop();
    } while (rest.length);

    if (!hasProp) {
      return;
    }
  } while ((isObject(obj) || Array.isArray(obj)) && ++idx < segs.length);

  return obj;
};

