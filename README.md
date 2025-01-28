# get-value [![NPM version](https://img.shields.io/npm/v/get-value.svg?style=flat)](https://www.npmjs.com/package/get-value) [![NPM monthly downloads](https://img.shields.io/npm/dm/get-value.svg?style=flat)](https://npmjs.org/package/get-value) [![NPM total downloads](https://img.shields.io/npm/dt/get-value.svg?style=flat)](https://npmjs.org/package/get-value)

> Use property paths like 'a.b.c' to get a nested value from an object. Even works when keys have dots in them (no other dot-prop library we tested does this, or does it correctly).

Please consider following this project's author, [Jon Schlinkert](https://github.com/jonschlinkert), and consider starring the project to show your :heart: and support.

## Table of Contents

<details>
<summary><strong>Details</strong></summary>

- [Install](#install)
- [Usage](#usage)
  * [Supports keys with dots](#supports-keys-with-dots)
  * [Supports arrays](#supports-arrays)
  * [Supports functions](#supports-functions)
  * [Supports passing object path as an array](#supports-passing-object-path-as-an-array)
- [Options](#options)
  * [options.default](#optionsdefault)
  * [options.isValid](#optionsisvalid)
  * [options.split](#optionssplit)
  * [options.separator](#optionsseparator)
  * [options.join](#optionsjoin)
  * [options.joinChar](#optionsjoinchar)
- [Benchmarks](#benchmarks)
  * [Running the benchmarks](#running-the-benchmarks)
- [Release history](#release-history)
  * [v4.0.0](#v400)
  * [v3.0.0](#v300)
- [About](#about)

</details>

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save get-value
```

## Usage

See the [unit tests](test/test.js) for many more examples.

```js
const get = require('get-value');
const obj = { a: { b: { c: { d: 'foo' } } } };

console.log(get(obj));            //=> { a: { b: { c: { d: 'foo' } } } };
console.log(get(obj, 'a'));       //=> { b: { c: { d: 'foo' } } }
console.log(get(obj, 'a.b'));     //=> { c: { d: 'foo' } }
console.log(get(obj, 'a.b.c'));   //=> { d: 'foo' }
console.log(get(obj, 'a.b.c.d')); //=> 'foo'
```

### Supports keys with dots

Unlike other dot-prop libraries, get-value works when keys have dots in them:

```js
console.log(get({ 'a.b': { c: 'd' } }, 'a.b.c'));
//=> 'd'

console.log(get({ 'a.b': { c: { 'd.e': 'f' } } }, 'a.b.c.d.e'));
//=> 'f'
```

### Supports arrays

```js
console.log(get({ a: { b: { c: { d: 'foo' } } }, e: [{ f: 'g' }, { f: 'h' }] }, 'e.1.f'));
//=> 'h'

console.log(get({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'));
//=> 'd'

console.log(get({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'));
//=> 'f'
```

### Supports functions

```js
function foo() {}
foo.bar = { baz: 'qux' };

console.log(get(foo));
//=> { [Function: foo] bar: { baz: 'qux' } }

console.log(get(foo, 'bar'));
//=> { baz: 'qux' }

console.log(get(foo, 'bar.baz'));
//=> qux
```

### Supports passing object path as an array

Slighly improve performance by passing an array of strings to use as object path segments (this is also useful when you need to dynamically build up the path segments):

```js
console.log(get({ a: { b: 'c' } }, ['a', 'b']));
//=> 'c'
```

## Options

### options.default

**Type**: `any`

**Default**: `undefined`

The default value to return when get-value cannot resolve a value from the given object.

```js
const obj = { foo: { a: { b: { c: { d: 'e' } } } } };
console.log(get(obj, 'foo.a.b.c.d', { default: true }));  //=> 'e'
console.log(get(obj, 'foo.bar.baz', { default: true }));  //=> true
console.log(get(obj, 'foo.bar.baz', { default: false })); //=> false
console.log(get(obj, 'foo.bar.baz', { default: null }));  //=> null

// you can also pass the default value as the last argument
// (this is necessary if the default value is an object)
console.log(get(obj, 'foo.a.b.c.d', true));  //=> 'e'
console.log(get(obj, 'foo.bar.baz', true));  //=> true
console.log(get(obj, 'foo.bar.baz', false)); //=> false
console.log(get(obj, 'foo.bar.baz', null));  //=> null
```

### options.isValid

**Type**: `function`

**Default**: `true`

If defined, this function is called on each resolved value. Useful if you want to do `.hasOwnProperty` or `Object.prototype.propertyIsEnumerable`.

```js
const isEnumerable = Object.prototype.propertyIsEnumerable;
const options = {
  isValid: (key, obj) => isEnumerable.call(obj, key)
};

const obj = {};
Object.defineProperty(obj, 'foo', { value: 'bar', enumerable: false });

console.log(get(obj, 'foo', options));           //=> undefined
console.log(get({}, 'hasOwnProperty', options)); //=> undefined
console.log(get({}, 'constructor', options));    //=> undefined

// without "isValid" check
console.log(get(obj, 'foo', options));           //=> bar
console.log(get({}, 'hasOwnProperty', options)); //=> [Function: hasOwnProperty]
console.log(get({}, 'constructor', options));    //=> [Function: Object]
```

### options.split

**Type**: `function`

**Default**: `String.split()`

Custom function to use for splitting the string into object path segments.

```js
const obj = { 'a.b': { c: { d: 'e' } } };

// example of using a string to split the object path
const options = { split: path => path.split('/') };
console.log(get(obj, 'a.b/c/d', options)); //=> 'e'

// example of using a regex to split the object path
// (removing escaped dots is unnecessary, this is just an example)
const options = { split: path => path.split(/\\?\./) };
console.log(get(obj, 'a\\.b.c.d', options)); //=> 'e'
```

### options.separator

**Type**: `string|regex`

**Default**: `.`

The separator to use for spliting the string (this is probably not needed when `options.split` is used).

```js
const obj = { 'a.b': { c: { d: 'e' } } };

console.log(get(obj, 'a.b/c/d', { separator: '/' }));
//=> 'e'

console.log(get(obj, 'a\\.b.c.d', { separator: /\\?\./ }));
//=> 'e'
```

### options.join

**Type**: `function`

**Default**: `Array.join()`

Customize how the object path is created when iterating over path segments.

```js
const obj = { 'a/b': { c: { d: 'e' } } };
const options = {
  // when segs === ['a', 'b'] use a "/" to join, otherwise use a "."
  join: segs => segs.join(segs[0] === 'a' ? '/' : '.')
};

console.log(get(obj, 'a.b.c.d', options));
//=> 'e'
```

### options.joinChar

**Type**: `string`

**Default**: `.`

The character to use when re-joining the string to check for keys with dots in them (this is probably not needed when `options.join` is used). This can be a different value than the separator, since the separator can be a string or regex.

```js
const target = { 'a-b': { c: { d: 'e' } } };
const options = { joinChar: '-' };
console.log(get(target, 'a.b.c.d', options));
//=> 'e'
```

## Benchmarks

_(benchmarks were run on a MacBook Pro 2.5 GHz Intel Core i7, 16 GB 1600 MHz DDR3)_.

get-value is more reliable and has more features than dot-prop, without sacrificing performance.

```
# deep (338 bytes)
  dot-prop x 2,524,501 ops/sec ±3.47% (90 runs sampled)
  dotty x 1,990,042 ops/sec ±1.10% (91 runs sampled)
  get-value x 3,776,247 ops/sec ±0.71% (98 runs sampled)
  getobject x 1,166,194 ops/sec ±2.94% (94 runs sampled)
  object-path x 975,380 ops/sec ±0.27% (97 runs sampled)

  fastest is get-value (by 50% avg)

# root (215 bytes)
  dot-prop x 18,774,512 ops/sec ±0.67% (95 runs sampled)
  dotty x 16,732,378 ops/sec ±0.66% (95 runs sampled)
  get-value x 35,516,146 ops/sec ±1.16% (92 runs sampled)
  getobject x 7,743,671 ops/sec ±2.99% (95 runs sampled)
  object-path x 11,955,285 ops/sec ±0.48% (95 runs sampled)

  fastest is get-value (by 89% avg)

# shallow (91 bytes)
  dot-prop x 10,195,874 ops/sec ±0.88% (95 runs sampled)
  dotty x 8,383,019 ops/sec ±0.81% (97 runs sampled)
  get-value x 9,891,229 ops/sec ±0.88% (90 runs sampled)
  getobject x 4,333,202 ops/sec ±1.52% (99 runs sampled)
  object-path x 4,568,894 ops/sec ±1.60% (94 runs sampled)

  fastest is dot-prop (by 3% avg)

```

### Running the benchmarks

Clone this library into a local directory:

```sh
$ git clone https://github.com/jonschlinkert/get-value.git
```

Then install devDependencies and run benchmarks:

```sh
$ npm install && node benchmark
```

## Release history

### v4.0.0

* Refactored to typescript
* Added support for handling deep property paths with arrays
* Improved performance on large nested objects
* Fixed edge case issues with keys containing special characters.
* Updated benchmarks
* Updated documentation to reflect new features and bug fixes.

### v3.0.0

* Improved support for escaping. It's no longer necessary to use backslashes to escape keys.
* Adds `options.default` for defining a default value to return when no value is resolved.
* Adds `options.isValid` to allow the user to check the object after each iteration.
* Adds `options.separator` for customizing character to split on.
* Adds `options.split` for customizing how the object path is split.
* Adds `options.join` for customizing how the object path is joined when iterating over path segments.
* Adds `options.joinChar` for customizing the join character.

## About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

</details>

<details>
<summary><strong>Running Tests</strong></summary>

Running and reviewing unit tests is a great way to get familiarized with a library and its API. You can install dependencies and run tests with the following command:

```sh
$ npm install && npm test
```

</details>

<details>
<summary><strong>Building docs</strong></summary>

_(This project's readme.md is generated by [verb](https://github.com/verbose/verb-generate-readme), please don't edit the readme directly. Any changes to the readme must be made in the [.verb.md](.verb.md) readme template.)_

To generate the readme, run the following command:

```sh
$ npm install -g verbose/verb#dev verb-generate-readme && verb
```

</details>

### Related projects

You might also be interested in these projects:

* [has-any-deep](https://www.npmjs.com/package/has-any-deep): Return true if `key` exists deeply on the given object.  | [homepage](https://github.com/jonschlinkert/has-any-deep "Return true if `key` exists deeply on the given object. ")
* [has-any](https://www.npmjs.com/package/has-any): Returns true if an object has any of the specified keys. | [homepage](https://github.com/jonschlinkert/has-any "Returns true if an object has any of the specified keys.")
* [has-value](https://www.npmjs.com/package/has-value): Returns true if a value exists, false if empty. Works with deeply nested values using… [more](https://github.com/jonschlinkert/has-value) | [homepage](https://github.com/jonschlinkert/has-value "Returns true if a value exists, false if empty. Works with deeply nested values using object paths.")
* [set-value](https://www.npmjs.com/package/set-value): Set nested properties on an object using dot notation. | [homepage](https://github.com/jonschlinkert/set-value "Set nested properties on an object using dot notation.")
* [unset-value](https://www.npmjs.com/package/unset-value): Delete nested properties from an object using dot notation. | [homepage](https://github.com/jonschlinkert/unset-value "Delete nested properties from an object using dot notation.")

### Contributors

| **Commits** | **Contributor** |  
| --- | --- |  
| 89 | [jonschlinkert](https://github.com/jonschlinkert) |  
| 2  | [doowb](https://github.com/doowb) |  
| 2  | [felladrin](https://github.com/felladrin) |  
| 1  | [onokumus](https://github.com/onokumus) |  
| 1  | [joepie91](https://github.com/joepie91) |  

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2025, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on January 28, 2025._