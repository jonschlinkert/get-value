const get = require('..');

console.log(get(null, 'foo.bar', false), false);
console.log(get('foo', 'foo.bar', false), false);
console.log(get([], 'foo.bar', false), false);
console.log(get(undefined, 'foo.bar', false), false);

var obj = { foo: { a: { b: { c: { d: 'e' } } } } };
console.log(get(obj, 'foo.a.b.c.d', { default: true }), 'e');
console.log(get(obj, 'foo.bar.baz', { default: true }), true);
console.log(get(obj, 'foo.bar.baz', { default: false }),  false);
console.log(get(obj, 'foo.bar.baz', { default: null }), null);

// you can also pass the default as the last argument
console.log(get(obj, 'foo.a.b.c.d', true), 'e');
console.log(get(obj, 'foo.bar.baz', true), true);
console.log(get(obj, 'foo.bar.baz', false),  false);
console.log(get(obj, 'foo.bar.baz', null), null);
