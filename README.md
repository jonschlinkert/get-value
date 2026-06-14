# get-value [![NPM version](https://img.shields.io/npm/v/get-value.svg?style=flat)](https://www.npmjs.com/package/get-value) [![NPM monthly downloads](https://img.shields.io/npm/dm/get-value.svg?style=flat)](https://npmjs.org/package/get-value) [![NPM total downloads](https://img.shields.io/npm/dt/get-value.svg?style=flat)](https://npmjs.org/package/get-value) [![GitHub Workflow Status](https://github.com/jonschlinkert/get-value/actions/workflows/test.yml/badge.svg)](https://github.com/jonschlinkert/get-value/actions/workflows/test.yml)

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
  * [v4.1.0](#v410)
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
import getValue from 'get-value';
// or
import { getValue } from 'get-value';
// or
const getValue = require('get-value');
const obj = { a: { b: { c: { d: 'foo' } } } };

console.log(getValue(obj));            //=> { a: { b: { c: { d: 'foo' } } } };
console.log(getValue(obj, 'a'));       //=> { b: { c: { d: 'foo' } } }
console.log(getValue(obj, 'a.b'));     //=> { c: { d: 'foo' } }
console.log(getValue(obj, 'a.b.c'));   //=> { d: 'foo' }
console.log(getValue(obj, 'a.b.c.d')); //=> 'foo'
```

### Supports keys with dots

Unlike other dot-prop libraries, `get-value` works when keys have dots in them:

```js
console.log(getValue({ 'a.b': { c: 'd' } }, 'a.b.c'));
//=> 'd'

console.log(getValue({ 'a.b': { c: { 'd.e': 'f' } } }, 'a.b.c.d.e'));
//=> 'f'
```

### Supports arrays

```js
console.log(getValue({ a: { b: { c: { d: 'foo' } } }, e: [{ f: 'g' }, { f: 'h' }] }, 'e.1.f'));
//=> 'h'

console.log(getValue({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'));
//=> 'd'

console.log(getValue({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'));
//=> 'f'
```

### Supports functions

```js
function foo() {}
foo.bar = { baz: 'qux' };

console.log(getValue(foo));
//=> { [Function: foo] bar: { baz: 'qux' } }

console.log(getValue(foo, 'bar'));
//=> { baz: 'qux' }

console.log(getValue(foo, 'bar.baz'));
//=> qux
```

### Supports passing object path as an array

Slightly improves performance by passing an array of strings to use as object path segments (this is also useful when you need to dynamically build up the path segments):

```js
console.log(getValue({ a: { b: 'c' } }, ['a', 'b']));
//=> 'c'
```

## Options

### options.default

**Type**: `any`

**Default**: `undefined`

The default value to return when get-value cannot resolve a value from the given object.

```js
const obj = { foo: { a: { b: { c: { d: 'e' } } } } };
console.log(getValue(obj, 'foo.a.b.c.d', { default: true }));  //=> 'e'
console.log(getValue(obj, 'foo.bar.baz', { default: true }));  //=> true
console.log(getValue(obj, 'foo.bar.baz', { default: false })); //=> false
console.log(getValue(obj, 'foo.bar.baz', { default: null }));  //=> null

// you can also pass the default value as the last argument
// (this is necessary if the default value is an object)
console.log(getValue(obj, 'foo.a.b.c.d', true));  //=> 'e'
console.log(getValue(obj, 'foo.bar.baz', true));  //=> true
console.log(getValue(obj, 'foo.bar.baz', false)); //=> false
console.log(getValue(obj, 'foo.bar.baz', null));  //=> null
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

console.log(getValue(obj, 'foo', options));           //=> undefined
console.log(getValue({}, 'hasOwnProperty', options)); //=> undefined
console.log(getValue({}, 'constructor', options));    //=> undefined

// without "isValid" check
console.log(getValue(obj, 'foo', options));           //=> bar
console.log(getValue({}, 'hasOwnProperty', options)); //=> [Function: hasOwnProperty]
console.log(getValue({}, 'constructor', options));    //=> [Function: Object]
```

### options.split

**Type**: `function`

**Default**: `String.split()`

Custom function to use for splitting the string into object path segments.

```js
const obj = { 'a.b': { c: { d: 'e' } } };

// example of using a string to split the object path
const options = { split: path => path.split('/') };
console.log(getValue(obj, 'a.b/c/d', options)); //=> 'e'

// example of using a regex to split the object path
// (removing escaped dots is unnecessary, this is just an example)
const options = { split: path => path.split(/\\?\./) };
console.log(getValue(obj, 'a\\.b.c.d', options)); //=> 'e'
```

### options.separator

**Type**: `string|regex`

**Default**: `.`

The separator to use for splitting the string (this is probably not needed when `options.split` is used).

```js
const obj = { 'a.b': { c: { d: 'e' } } };

console.log(getValue(obj, 'a.b/c/d', { separator: '/' }));
//=> 'e'

console.log(getValue(obj, 'a\\.b.c.d', { separator: /\\?\./ }));
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

console.log(getValue(obj, 'a.b.c.d', options));
//=> 'e'
```

### options.joinChar

**Type**: `string`

**Default**: `.`

The character to use when re-joining the string to check for keys with dots in them (this is probably not needed when `options.join` is used). This can be a different value than the separator, since the separator can be a string or regex.

```js
const target = { 'a-b': { c: { d: 'e' } } };
const options = { joinChar: '-' };
console.log(getValue(target, 'a.b.c.d', options));
//=> 'e'
```

## Benchmarks

_(benchmarks were run on a MacBook Pro 2.5 GHz Intel Core i7, 16 GB 1600 MHz DDR3)_.

get-value is more reliable and has more features than dot-prop, without sacrificing performance.

```
# deep (338 bytes)
  dot-prop x 5,319,159 ops/sec ±0.76% (93 runs sampled)
  dotty x 3,870,706 ops/sec ±0.26% (96 runs sampled)
  get-value x 8,788,576 ops/sec ±0.19% (100 runs sampled)
  getobject x 1,979,207 ops/sec ±0.17% (98 runs sampled)
  object-path x 1,761,814 ops/sec ±0.25% (100 runs sampled)

  fastest is get-value (by 65% avg)

# root (215 bytes)
  dot-prop x 41,761,355 ops/sec ±0.89% (93 runs sampled)
  dotty x 29,943,256 ops/sec ±0.55% (99 runs sampled)
  get-value x 65,184,370 ops/sec ±1.00% (96 runs sampled)
  getobject x 13,780,598 ops/sec ±0.35% (98 runs sampled)
  object-path x 21,255,148 ops/sec ±0.45% (101 runs sampled)

  fastest is get-value (by 56% avg)

# shallow (91 bytes)
  dot-prop x 21,019,241 ops/sec ±0.46% (93 runs sampled)
  dotty x 15,912,833 ops/sec ±0.76% (96 runs sampled)
  get-value x 19,824,809 ops/sec ±0.40% (91 runs sampled)
  getobject x 7,537,059 ops/sec ±0.15% (97 runs sampled)
  object-path x 8,519,654 ops/sec ±0.21% (99 runs sampled)

  fastest is dot-prop (by 6% avg)

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

### v4.1.0

* Adds support for `Map`-like objects, allowing objects with a `get` method that can be used to retrieve values by key.
* Removed outdated travis config, and added GitHub Actions workflow for running tests.

### v4.0.0

* Refactored to TypeScript
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

Please read the [contributing guide](.github/contributing.md) for advice on opening issues, pull requests, and coding standards.

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
| 94 | [jonschlinkert](https://github.com/jonschlinkert) |  
| 2  | [doowb](https://github.com/doowb) |  
| 2  | [felladrin](https://github.com/felladrin) |  
| 1  | [onokumus](https://github.com/onokumus) |  
| 1  | [joepie91](https://github.com/joepie91) |  
| 1  | [sonofmagic](https://github.com/sonofmagic) |  

### Author

**Jon Schlinkert**

* [GitHub Profile](https://github.com/jonschlinkert)
* [X Profile](https://x.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

### License

Copyright © 2026, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT License](LICENSE).

***

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on June 14, 2026._