'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var argv = require('minimist')(process.argv.slice(2));
var files = fs.readdirSync('./benchmark/code');
var dotProp = require('dot-prop');
var get = require('./');

if (argv.bench) {
  get = require(path.resolve('benchmark/code', argv.bench));
}

if (argv.dot) {
  get = dotProp.get;
}

describe('get value:', function() {
  it('should return invalid args', function() {
    assert.strictEqual(get(null), null);
    assert.strictEqual(get('foo'), 'foo');
    assert.deepEqual(get(['a']), ['a']);
  });

  it('should get a value', function() {
    assert.strictEqual(get({a: 'a', b: {c: 'd'}}, 'a'), 'a');
    assert.strictEqual(get({a: 'a', b: {c: 'd'}}, 'b.c'), 'd');
  });

  it('should get a property that has dots in the key', function() {
    assert.strictEqual(get({'a.b': 'c'}, 'a.b'), 'c');
  });

  it('should support using dot notation to get nested values', function() {
    var fixture = {
      a: {locals: {name: {first: 'Brian'}}},
      b: {locals: {name: {last: 'Woodward'}}},
      c: {locals: {paths: ['a.txt', 'b.js', 'c.hbs']}}
    };
    assert.deepEqual(get(fixture, 'a.locals.name'), {first: 'Brian'});
    assert.deepEqual(get(fixture, 'b.locals.name'), {last: 'Woodward'});
    assert.deepEqual(get(fixture, 'b.locals.name.last'), 'Woodward');
    assert.deepEqual(get(fixture, 'c.locals.paths.0'), 'a.txt');
    assert.deepEqual(get(fixture, 'c.locals.paths.1'), 'b.js');
    assert.deepEqual(get(fixture, 'c.locals.paths.2'), 'c.hbs');
  });

  it('should get specified position from an array', function() {
    var fixture = {
      a: {paths: ['a.txt', 'a.js', 'a.hbs']},
      b: {paths: {
        '0': 'b.txt',
        '1': 'b.js',
        '2': 'b.hbs',
        3: 'b3.hbs'
      }}
    }
    assert.deepEqual(get(fixture, 'a.paths.0'), 'a.txt');
    assert.deepEqual(get(fixture, 'a.paths.1'), 'a.js');
    assert.deepEqual(get(fixture, 'a.paths.2'), 'a.hbs');

    assert.deepEqual(get(fixture, 'b.paths.0'), 'b.txt');
    assert.deepEqual(get(fixture, 'b.paths.1'), 'b.js');
    assert.deepEqual(get(fixture, 'b.paths.2'), 'b.hbs');
    assert.deepEqual(get(fixture, 'b.paths.3'), 'b3.hbs');
  });

  it('should return `undefined` if the path is not found', function() {
    var fixture = {};
    assert.strictEqual(get(fixture, 'a.locals.name'), undefined);
    assert.strictEqual(get(fixture, 'b.locals.name'), undefined);
  });

  it('should get the specified property', function() {
    assert.deepEqual(get({a: 'aaa', b: 'b'}, 'a'), 'aaa');
    assert.deepEqual(get({first: 'Jon', last: 'Schlinkert'}, 'first'), 'Jon');
    assert.deepEqual(get({locals: {a: 'a'}, options: {b: 'b'}}, 'locals'), {a: 'a'});
  });

  it('should support passing a property formatted as an array', function() {
    assert.strictEqual(get({a: 'aaa', b: 'b'}, ['a']), 'aaa');
    assert.strictEqual(get({a: {b: {c: 'd'}}}, ['a', 'b', 'c']), 'd');
    assert.strictEqual(get({first: 'Jon', last: 'Schlinkert'}, ['first']), 'Jon');
    assert.deepEqual(get({locals: {a: 'a'}, options: {b: 'b'}}, ['locals']), {a: 'a'});
  });

  it('should support properties that are a combination of string/array', function() {
    assert.strictEqual(get({a: {b: {c: {d: {e: {f: {g: 'h'}}}}}}}, ['a'], 'b', ['c', 'd.e'], 'f.g'), 'h');
  });

  it('should ignore dots in escaped keys when `true` is passed', function() {
    assert.deepEqual(get({'a.b': 'a', b: {c: 'd'}}, 'a\\.b'), 'a');
    assert.deepEqual(get({'a.b': {b: {c: 'd'}}}, 'a\\.b.b.c'), 'd');
  });

  it('should get the value of a deeply nested property', function() {
    assert.deepEqual(get({a: {b: 'c', c: {d: 'e', e: 'f', g: {h: 'i'}}}}, 'a.c.g.h'), 'i');
  });

  it('should return the entire object if no property is passed', function() {
    assert.deepEqual(get({a: 'a', b: {c: 'd'}}), {a: 'a', b: {c: 'd'}});
  });
});

describe('dot-prop tests:', function() {
  it('should pass all of the dot-prop tests', function() {
    var f1 = {foo: {bar: 1}};
    assert.deepEqual(get(f1), f1);
    assert.deepEqual(get(f1, 'foo'), f1.foo);
    assert.deepEqual(get({foo: 1}, 'foo'), 1);
    assert.strictEqual(get({foo: null}, 'foo'), null);
    assert.strictEqual(get({foo: undefined}, 'foo'), undefined);
    assert.strictEqual(get({foo: {bar: true}}, 'foo.bar'), true);
    assert.strictEqual(get({foo: {bar: {baz: true}}}, 'foo.bar.baz'), true);
    assert.strictEqual(get({foo: {bar: {baz: null}}}, 'foo.bar.baz'), null);
    assert.strictEqual(get({foo: {bar: 'a'}}, 'foo.fake.fake2'), undefined);
  });
});
