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

  let segs = isArray ? path : path.split('.');
  let obj = target;

  do {
    let prop = segs[0];

    while (prop && prop.slice(-1) === '\\') {
      prop = prop.slice(0, -1) + '.' + (segs[1] || '');
      segs.shift();
      segs[0] = prop;
    }

    if (prop in obj) {
      obj = obj[segs.shift()];
      continue;
    }

    let rest = segs.slice();
    let hasProp = false;

    do {
      const prop = rest.join('.');

      if ((hasProp = (prop in obj))) {
        segs = segs.slice(rest.length);
        obj = obj[prop];
        break;
      }

      rest.pop();
    } while (rest.length);

    if (!hasProp) {
      return;
    }
  } while (segs.length && (isObject(obj) || Array.isArray(obj)));

  return obj;
};
