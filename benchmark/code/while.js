
module.exports = getValue;

function getValue(o, prop) {
  if (o == null) { return {}; }
  if (typeof prop !== 'string') {
    return o;
  }

  const path = prop.split('.');
  const last = path.pop();
  let len = path.length;
  let i = 0;

  while (len--) {
    o = o[path[i++]];
    if (!o) return o;
  }

  return o[last];
}
