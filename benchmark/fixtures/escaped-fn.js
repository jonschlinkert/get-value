/**
 * Escaped dots. Some of the fns will fail on this.
 *
 * The last arg, `true` only has meaning for fns that
 * do escaping.
 */

function replaceStr(str, pattern, replacement) {
  var i, from = 0;
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

function escape(str) {
  str = replaceStr(str, '\\.', '___DOT___');
  return str.split('.').map(function (seg) {
    return replaceStr(seg, '___DOT___', '.');
  });
}

module.exports = [{'a.b.c': {d: {e: {f: {g: 'THE END!'}}}}}, 'a\\.b\\.c.d.e.f.g', escape];