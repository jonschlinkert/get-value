
module.exports = getValue;

function getValue(o, prop) {
  if (o == null) { return {}; }
  if (typeof prop !== 'string') {
    return o;
  }

  var path = prop.split('.');
  var last = path.pop();
  var len = path.length;
  var i = 0;

  while (len--) {
    o = o[path[i++]];
    if (!o) return o;
  }

  return o[last];
};
