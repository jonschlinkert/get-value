const get = require('..');

const obj = { 'a/b': { c: { d: 'e' } } };
const options = {
  join: segs => segs.join(segs[0] === 'a' ? '/' : '.')
};

console.log(get(obj, 'a.b.c.d', options));
//=> 'e'
