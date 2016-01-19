'use strict';

require('mocha');
require('should');
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
    assert(get(null) === null);
    assert(get('foo') === 'foo');
    assert.deepEqual(get(['a']), ['a']);
  });

  it('should get the value only (not the key and value).', function() {
    assert(get({a: 'a', b: {c: 'd'}}, 'a') === 'a');
    assert(get({a: 'a', b: {c: 'd'}}, 'b.c') === 'd');
  });

  it('should support array notation', function() {
    var obj = { e: [ {f : 'g'} ] };
    assert.equal(get(obj, 'e[0].f'), 'g');
    assert.equal(get(obj, 'e.0.f'), 'g');
  });

  it('should get a property that has dots in the key', function() {
    assert(get({'a.b': 'c'}, 'a.b') === 'c');
  });

  it('should support using dot notation to get nested values', function() {
    var fixture = {
      a: {locals: {name: {first: 'Brian'}}},
      b: {locals: {name: {last: 'Woodward'}}},
      c: {locals: {paths: ['a.txt', 'b.js', 'c.hbs']}}
    };
    get(fixture, 'a.locals.name').should.eql({first: 'Brian'});
    get(fixture, 'b.locals.name').should.eql({last: 'Woodward'});
    get(fixture, 'b.locals.name.last').should.eql('Woodward');
    get(fixture, 'c.locals.paths.0').should.eql('a.txt');
    get(fixture, 'c.locals.paths.1').should.eql('b.js');
    get(fixture, 'c.locals.paths.2').should.eql('c.hbs');
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
    get(fixture, 'a.paths.0').should.eql('a.txt');
    get(fixture, 'a.paths.1').should.eql('a.js');
    get(fixture, 'a.paths.2').should.eql('a.hbs');

    get(fixture, 'b.paths.0').should.eql('b.txt');
    get(fixture, 'b.paths.1').should.eql('b.js');
    get(fixture, 'b.paths.2').should.eql('b.hbs');
    get(fixture, 'b.paths.3').should.eql('b3.hbs');
  });

  it('should return `undefined` if the path is not found', function() {
    var fixture = {};
    assert(get(fixture, 'a.locals.name') === undefined);
    assert(get(fixture, 'b.locals.name') === undefined);
  });

  it('should get the specified property.', function() {
    get({a: 'aaa', b: 'b'}, 'a').should.eql('aaa');
    get({first: 'Jon', last: 'Schlinkert'}, 'first').should.eql('Jon');
    get({locals: {a: 'a'}, options: {b: 'b'}}, 'locals').should.eql({a: 'a'});
  });

  it('should support passing an array as the property', function() {
    assert(get({a: 'aaa', b: 'b'}, ['a']) === 'aaa');
    assert(get({a: {b: {c: 'd'}}}, ['a', 'b', 'c']) === 'd');
    assert(get({first: 'Jon', last: 'Schlinkert'}, ['first']) === 'Jon');
    get({locals: {a: 'a'}, options: {b: 'b'}}, ['locals']).should.eql({a: 'a'});
  });

  it('should ignore dots in escaped keys when `true` is passed.', function() {
    get({'a.b': 'a', b: {c: 'd'}}, 'a\\.b').should.eql('a');
    get({'a.b': {b: {c: 'd'}}}, 'a\\.b.b.c').should.eql('d');
  });

  it('should get the value of a deeply nested property.', function() {
    get({a: {b: 'c', c: {d: 'e', e: 'f', g: {h: 'i'}}}}, 'a.c.g.h').should.eql('i');
  });

  it('should return the entire object if no property is passed.', function() {
    get({a: 'a', b: {c: 'd'}}).should.eql({a: 'a', b: {c: 'd'}});
  });
});

describe('dot-prop tests:', function() {
  it('should pass all of the dot-prop tests.', function() {
    var f1 = {foo: {bar: 1}};
    get(f1).should.eql(f1);
    get(f1, 'foo').should.eql(f1.foo);
    get({foo: 1}, 'foo').should.eql(1);
    assert(get({foo: null}, 'foo') === null);
    assert(get({foo: undefined}, 'foo') === undefined);
    get({foo: {bar: true}}, 'foo.bar').should.equal(true);
    get({foo: {bar: {baz: true}}}, 'foo.bar.baz').should.equal(true);
    assert(get({foo: {bar: {baz: null}}}, 'foo.bar.baz') === null);
    assert(get({foo: {bar: 'a'}}, 'foo.fake.fake2') === undefined);
  });
});
