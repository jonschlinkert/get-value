import getValue from '..';

const obj = { 'a/b': { c: { d: 'e' } } };
const options = {
  join: segs => segs.join(segs[0] === 'a' ? '/' : '.')
};

console.log(getValue(obj, 'a.b.c.d', options));
//=> 'e'
