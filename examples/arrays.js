import getValue from '..';

console.log(getValue({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'), 'd');
console.log(getValue({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'), 'f');
