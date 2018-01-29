
var isObject = require('isobject');

module.exports = function getValue(obj, prop) {
  if (obj == null) { return {}; }
  if (typeof prop !== 'string') {
    return obj;
  }

  var path = prop.split('.');
  var last = path.pop();
  var len = path.length;

  for (var i = 0; i < len; i++) {
    obj = obj[path[i]];
    if (!isObject(obj)) {
      return obj;
    }
  }

  return obj[last];
};
