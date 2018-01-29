const get = require('..');

console.log(get({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'), 'd');
console.log(get({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'), 'f');
