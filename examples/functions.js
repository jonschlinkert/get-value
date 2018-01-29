const get = require('..');

function foo() {}
foo.bar = { baz: 'qux' };
console.log(get(foo));            //=> { [Function: foo] bar: { baz: 'qux' } }
console.log(get(foo, 'bar'));     //=> { baz: 'qux' }
console.log(get(foo, 'bar.baz')); //=> qux


