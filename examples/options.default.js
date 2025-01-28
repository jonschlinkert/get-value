import getValue from '..';

console.log(getValue(null, 'foo.bar', false), false);
console.log(getValue('foo', 'foo.bar', false), false);
console.log(getValue([], 'foo.bar', false), false);
console.log(getValue(undefined, 'foo.bar', false), false);

const obj = { foo: { a: { b: { c: { d: 'e' } } } } };
console.log(getValue(obj, 'foo.a.b.c.d', { default: true }), 'e');
console.log(getValue(obj, 'foo.bar.baz', { default: true }), true);
console.log(getValue(obj, 'foo.bar.baz', { default: false }), false);
console.log(getValue(obj, 'foo.bar.baz', { default: null }), null);

// you can also pass the default as the last argument
console.log(getValue(obj, 'foo.a.b.c.d', true), 'e');
console.log(getValue(obj, 'foo.bar.baz', true), true);
console.log(getValue(obj, 'foo.bar.baz', false), false);
console.log(getValue(obj, 'foo.bar.baz', null), null);
