
var isObject = require('isobject');

module.exports = function getValue(o, prop) {
  if (o == null) { return {}; }
  if (typeof prop !== 'string') {
    return o;
  }

  var path = prop.split('.');
  var last = path.pop();
  var len = path.length;

  for (var i = 0; i < len; i++) {
    o = o[path[i]];
    if (!o) {
      return o;
    }
  }

  return o[last];
};
