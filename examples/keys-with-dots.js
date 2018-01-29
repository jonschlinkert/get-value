const get = require('..');

console.log(get({ files: { 'foo/bar.md': { b: 'c' } } }, 'files.foo/bar.md'));
//=> { b: c }

console.log(get({ 'a.b': { c: 'd' } }, 'a.b.c'));
//=> 'd'

console.log(get({ 'a.b': { c: { 'd.e': 'f' } } }, 'a.b.c.d.e'));
//=> 'f'
