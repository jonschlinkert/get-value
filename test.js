/*!
 * get-value <https://github.com/jonschlinkert/get-value>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/* deps:mocha */
require('should');
var fs = require('fs');
var path = require('path');
var argv = require('minimist')(process.argv.slice(2));
var files = fs.readdirSync('./benchmark/code');
var get = require('./');

var keys = Object.keys(argv);
if (keys && keys[1]) {
  var lib = files.filter(function (fp) {
    return keys[1] === path.basename(fp, path.extname(fp));
  });
  get = require(path.resolve('./benchmark/code/' + lib[0]));
}

describe('get value:', function() {
  it('should use property paths to get nested values from the source object.', function () {
    var fixture = {
      a: {locals : {name: {first: 'Brian'}}},
      b: {locals : {name: {last: 'Woodward'}}}
    };
    get(fixture, 'a.locals.name').should.eql({first: 'Brian'});
    get(fixture, 'b.locals.name').should.eql({last: 'Woodward'});
    get(fixture, 'b.locals.name.last').should.eql('Woodward');
  });

  it('should return `undefined` if the path is not found', function () {
    var fixture = {};
    (get(fixture, 'a.locals.name') === undefined).should.be.true;
    (get(fixture, 'b.locals.name') === undefined).should.be.true;
  });

  it('should get the specified property.', function () {
    get({a: 'aaa', b: 'b'}, 'a').should.eql('aaa');
    get({first: 'Jon', last: 'Schlinkert'}, 'first').should.eql('Jon');
    get({locals: {a: 'a'}, options: {b: 'b'}}, 'locals').should.eql({a: 'a'});
  });

  it('should get a value only.', function () {
    get({a: 'a', b: {c: 'd'}}, 'a').should.eql('a');
  });

  it('should ignore dots in escaped keys when `true` is passed.', function () {
    get({'a.b': 'a', b: {c: 'd'}}, 'a\\.b', true).should.eql('a');
    get({'a.b': {b: {c: 'd'}}}, 'a\\.b.b.c', true).should.eql('d');
  });

  it('should get a value only.', function () {
    get({a: 'a', b: {c: 'd'}}, 'b.c').should.eql('d');
  });

  it('should get the value of a deeply nested property.', function () {
    get({a: {b: 'c', c: {d: 'e', e: 'f', g: {h: 'i'}}}}, 'a.c.g.h').should.eql('i');
  });
});

describe('args:', function () {
  it('should return the entire object if no property is passed.', function () {
    get({a: 'a', b: {c: 'd'}}).should.eql({a: 'a', b: {c: 'd'}});
  });
});

describe('dot-prop tests:', function () {
  it('should pass all of the dot-prop tests.', function () {
    var f1 = {foo: {bar: 1}};
    get(f1).should.eql(f1);
    get(f1, 'foo').should.eql(f1.foo);
    get({foo: 1}, 'foo').should.eql(1);
    (get({foo: null}, 'foo') === null).should.be.true;
    (get({foo: undefined}, 'foo') === undefined).should.be.true;
    get({foo: {bar: true}}, 'foo.bar').should.equal(true);
    get({foo: {bar: {baz: true}}}, 'foo.bar.baz').should.equal(true);
    (get({foo: {bar: {baz: null}}}, 'foo.bar.baz') === null).should.be.true;
    (get({foo: {bar: 'a'}}, 'foo.fake.fake2') === undefined).should.be.true;
  });
});
