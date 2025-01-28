import getValue from '..';

function foo() {}
foo.bar = { baz: 'qux' };
console.log(getValue(foo)); //=> { [Function: foo] bar: { baz: 'qux' } }
console.log(getValue(foo, 'bar')); //=> { baz: 'qux' }
console.log(getValue(foo, 'bar.baz')); //=> qux

