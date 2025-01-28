import getValue from '..';

console.log(getValue({ files: { 'foo/bar.md': { b: 'c' } } }, 'files.foo/bar.md'));
//=> { b: c }

console.log(getValue({ 'a.b': { c: 'd' } }, 'a.b.c'));
//=> 'd'

console.log(getValue({ 'a.b': { c: { 'd.e': 'f' } } }, 'a.b.c.d.e'));
//=> 'f'
