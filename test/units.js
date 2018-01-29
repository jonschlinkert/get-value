'use strict';

var assert = require('assert');

module.exports = function(get) {
  describe('get value:', function() {
    it('should return invalid args', function() {
      assert.deepStrictEqual(get(null), null);
      assert.deepStrictEqual(get('foo'), 'foo');
      assert.deepStrictEqual(get(['a']), ['a']);
    });

    it('should get a value', function() {
      assert.deepStrictEqual(get({ a: 'a', b: { c: 'd' } }, 'a'), 'a');
      assert.deepStrictEqual(get({ a: 'a', b: { c: 'd' } }, 'b.c'), 'd');
      assert.deepStrictEqual(get({ foo: 'bar' }, 'foo.bar'), undefined);
    });

    it('should get a property that has dots in the key', function() {
      assert.deepStrictEqual(get({ 'a.b': 'c' }, 'a.b'), 'c');
    });

    it('should support using dot notation to get nested values', function() {
      var fixture = {
        a: { locals: { name: { first: 'Brian' } } },
        b: { locals: { name: { last: 'Woodward' } } },
        c: { locals: { paths: ['a.txt', 'b.js', 'c.hbs'] } }
      };
      assert.deepStrictEqual(get(fixture, 'a.locals.name'), { first: 'Brian' });
      assert.deepStrictEqual(get(fixture, 'b.locals.name'), { last: 'Woodward' });
      assert.strictEqual(get(fixture, 'b.locals.name.last'), 'Woodward');
      assert.strictEqual(get(fixture, 'c.locals.paths.0'), 'a.txt');
      assert.strictEqual(get(fixture, 'c.locals.paths.1'), 'b.js');
      assert.strictEqual(get(fixture, 'c.locals.paths.2'), 'c.hbs');
    });

    it('should support a custom separator on options.separator', function() {
      var fixture = { 'a.b': { c: { d: 'e' } } };
      assert.strictEqual(get(fixture, 'a.b/c/d', { separator: '/' }), 'e');
      assert.strictEqual(get(fixture, 'a\\.b.c.d', { separator: /\\?\./ }), 'e');
    });

    it('should support a custom split function', function() {
      var fixture = { 'a.b': { c: { d: 'e' } } };
      assert.strictEqual(get(fixture, 'a.b/c/d', { split: path => path.split('/') }), 'e');
      assert.strictEqual(get(fixture, 'a\\.b.c.d', { split: path => path.split(/\\?\./) }), 'e');
    });

    it('should support a custom join character', function() {
      var fixture = { 'a-b': { c: { d: 'e' } } };
      var options = { joinChar: '-' };
      assert.strictEqual(get(fixture, 'a.b.c.d', options), 'e');
    });

    it('should support a custom join function', function() {
      var fixture = { 'a-b': { c: { d: 'e' } } };
      var options = {
        split: path => path.split(/[-\/]/),
        join: segs => segs.join('-')
      };
      assert.strictEqual(get(fixture, 'a/b-c/d', options), 'e');
    });

    it('should support a default value as the last argument', function() {
      var fixture = { foo: { c: { d: 'e' } } };
      assert.equal(get(fixture, 'foo.bar.baz', 'quz'), 'quz');
      assert.equal(get(fixture, 'foo.bar.baz', true), true);
      assert.equal(get(fixture, 'foo.bar.baz', false), false);
      assert.equal(get(fixture, 'foo.bar.baz', null), null);
    });

    it('should support options.default', function() {
      var fixture = { foo: { c: { d: 'e' } } };
      assert.equal(get(fixture, 'foo.bar.baz', { default: 'qux' }), 'qux');
      assert.equal(get(fixture, 'foo.bar.baz', { default: true }), true);
      assert.equal(get(fixture, 'foo.bar.baz', { default: false }), false);
      assert.equal(get(fixture, 'foo.bar.baz', { default: null }), null);
      assert.deepStrictEqual(get(fixture, 'foo.bar.baz', { default: { one: 'two' } }), { one: 'two' });
    });

    it('should support a custom function for validating the object', function() {
      const isEnumerable = Object.prototype.propertyIsEnumerable;
      const options = {
        isValid: function(key, obj) {
          return isEnumerable.call(obj, key);
        }
      };

      var fixture = { 'a.b': { c: { d: 'e' } } };
      assert.strictEqual(get(fixture, 'a.b.c.d', options), 'e');
    });

    it('should support nested keys with dots', function() {
      assert.strictEqual(get({ 'a.b.c': 'd' }, 'a.b.c'), 'd');
      assert.strictEqual(get({ 'a.b': { c: 'd' } }, 'a.b.c'), 'd');
      assert.strictEqual(get({ 'a.b': { c: { d: 'e' } } }, 'a.b.c.d'), 'e');
      assert.strictEqual(get({ a: { b: { c: 'd' } } }, 'a.b.c'), 'd');
      assert.strictEqual(get({ a: { 'b.c': 'd' } }, 'a.b.c'), 'd');
      assert.strictEqual(get({ 'a.b.c.d': 'e' }, 'a.b.c.d'), 'e');
      assert.strictEqual(get({ 'a.b.c.d': 'e' }, 'a.b.c'), undefined);

      assert.strictEqual(get({ 'a.b.c.d.e.f': 'g' }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b.c.d.e': { f: 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b.c.d': { e: { f: 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b.c': { d: { e: { f: 'g' } } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b': { c: { d: { e: { f: 'g' } } } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ a: { b: { c: { d: { e: { f: 'g' } } } } } }, 'a.b.c.d.e.f'), 'g');

      assert.deepStrictEqual(get({ 'a.b.c.d.e': { f: 'g' } }, 'a.b.c.d.e'), { f: 'g' });
      assert.deepStrictEqual(get({ 'a.b.c.d': { 'e.f': 'g' } }, 'a.b.c.d.e'), undefined);
      assert.deepStrictEqual(get({ 'a.b.c': { 'd.e.f': 'g' } }, 'a.b.c'), { 'd.e.f': 'g' });
      assert.deepStrictEqual(get({ 'a.b': { 'c.d.e.f': 'g' } }, 'a.b'), { 'c.d.e.f': 'g' });
      assert.deepStrictEqual(get({ a: { 'b.c.d.e.f': 'g' } }, 'a'), { 'b.c.d.e.f': 'g' });

      assert.strictEqual(get({ 'a.b.c.d.e': { f: 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b.c.d': { 'e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b.c': { 'd.e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b': { 'c.d.e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ a: { 'b.c.d.e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');

      assert.strictEqual(get({ 'a.b': { 'c.d': { 'e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ 'a.b': { c: { 'd.e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ a: { 'b.c.d.e': { f: 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ a: { 'b.c.d': { 'e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ a: { 'b.c': { 'd.e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.strictEqual(get({ a: { b: { 'c.d.e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
    });

    it('should support return default when options.isValid returns false', function() {
      var fixture = { foo: { bar: { baz: 'qux' }, 'a.b.c': 'xyx', yyy: 'zzz' } };
      const options = val => {
        return Object.assign({}, {
          default: val,
          isValid: function(key) {
            return key !== 'bar' && key !== 'a.b.c';
          }
        });
      };

      assert.equal(get(fixture, 'foo.bar.baz', options('fez')), 'fez');
      assert.equal(get(fixture, 'foo.bar.baz', options(true)), true);
      assert.equal(get(fixture, 'foo.bar.baz', options(false)), false);
      assert.equal(get(fixture, 'foo.bar.baz', options(null)), null);

      assert.equal(get(fixture, 'foo.a.b.c', options('fez')), 'fez');
      assert.equal(get(fixture, 'foo.a.b.c', options(true)), true);
      assert.equal(get(fixture, 'foo.a.b.c', options(false)), false);
      assert.equal(get(fixture, 'foo.a.b.c', options(null)), null);

      assert.equal(get(fixture, 'foo.yyy', options('fez')), 'zzz');
    });

    it('should get a value from an array', function() {
      var fixture = {
        a: { paths: ['a.txt', 'a.js', 'a.hbs'] },
        b: {
          paths: {
            '0': 'b.txt',
            '1': 'b.js',
            '2': 'b.hbs',
            3: 'b3.hbs'
          }
        }
      };
      assert.strictEqual(get(fixture, 'a.paths.0'), 'a.txt');
      assert.strictEqual(get(fixture, 'a.paths.1'), 'a.js');
      assert.strictEqual(get(fixture, 'a.paths.2'), 'a.hbs');

      assert.strictEqual(get(fixture, 'b.paths.0'), 'b.txt');
      assert.strictEqual(get(fixture, 'b.paths.1'), 'b.js');
      assert.strictEqual(get(fixture, 'b.paths.2'), 'b.hbs');
      assert.strictEqual(get(fixture, 'b.paths.3'), 'b3.hbs');
    });

    it('should get a value from an object in an array', function() {
      assert.strictEqual(get({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'), 'd');
      assert.strictEqual(get({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'), 'f');
    });

    it('should return `undefined` if the path is not found', function() {
      var fixture = { a: { b: {} } };
      assert.strictEqual(get(fixture, 'a.b.c'), undefined);
      assert.strictEqual(get(fixture, 'a.b.c.d'), undefined);
    });

    it('should get the specified property', function() {
      assert.deepStrictEqual(get({ a: 'aaa', b: 'b' }, 'a'), 'aaa');
      assert.deepStrictEqual(get({ first: 'Jon', last: 'Schlinkert' }, 'first'), 'Jon');
      assert.deepStrictEqual(get({ locals: { a: 'a' }, options: { b: 'b' } }, 'locals'), { a: 'a' });
    });

    it('should support passing a property formatted as an array', function() {
      assert.deepStrictEqual(get({ a: 'aaa', b: 'b' }, ['a']), 'aaa');
      assert.deepStrictEqual(get({ a: { b: { c: 'd' } } }, ['a', 'b', 'c']), 'd');
      assert.deepStrictEqual(get({ first: 'Harry', last: 'Potter' }, ['first']), 'Harry');
      assert.deepStrictEqual(get({ locals: { a: 'a' }, options: { b: 'b' } }, ['locals']), { a: 'a' });
    });

    it('should support escaped dots', function() {
      assert.deepStrictEqual(get({ 'a.b': 'a', b: { c: 'd' } }, 'a\\.b'), 'a');
      assert.deepStrictEqual(get({ 'a.b': { b: { c: 'd' } } }, 'a\\.b.b.c'), 'd');
    });

    it('should get the value of a deeply nested property', function() {
      assert.strictEqual(get({ a: { b: 'c', c: { d: 'e', e: 'f', g: { h: 'i' } } } }, 'a.c.g.h'), 'i');
    });

    it('should return the entire object if no property is passed', function() {
      assert.deepStrictEqual(get({ a: 'a', b: { c: 'd' } }), { a: 'a', b: { c: 'd' } });
    });
  });

  /**
   * These tests are from dot-prop
   */

  describe('dot-prop tests:', function() {
    it('should pass dot-prop tests', function() {
      const f1 = { foo: { bar: 1 } };
      assert.deepStrictEqual(get(f1), f1);
      f1[''] = 'foo';
      assert.deepStrictEqual(get(f1, ''), 'foo');
      assert.deepStrictEqual(get(f1, 'foo'), f1.foo);
      assert.deepStrictEqual(get({ foo: 1 }, 'foo'), 1);
      assert.deepStrictEqual(get({ foo: null }, 'foo'), null);
      assert.deepStrictEqual(get({ foo: undefined }, 'foo'), undefined);
      assert.deepStrictEqual(get({ foo: { bar: true } }, 'foo.bar'), true);
      assert.deepStrictEqual(get({ foo: { bar: { baz: true } } }, 'foo.bar.baz'), true);
      assert.deepStrictEqual(get({ foo: { bar: { baz: null } } }, 'foo.bar.baz'), null);
      assert.deepStrictEqual(get({ '\\': true }, '\\'), true);
      assert.deepStrictEqual(get({ '\\foo': true }, '\\foo'), true);
      assert.deepStrictEqual(get({ 'bar\\': true }, 'bar\\'), true);
      assert.deepStrictEqual(get({ 'foo\\bar': true }, 'foo\\bar'), true);
      assert.deepStrictEqual(get({ '\\.foo': true }, '\\\\.foo'), true);
      assert.deepStrictEqual(get({ 'bar\\.': true }, 'bar\\\\.'), true);
      assert.deepStrictEqual(get({ 'foo\\.bar': true }, 'foo\\\\.bar'), true);
      assert.deepStrictEqual(get({ foo: 1 }, 'foo.bar'), undefined);

      function fn() {}
      fn.foo = { bar: 1 };
      assert.deepStrictEqual(get(fn), fn);
      assert.deepStrictEqual(get(fn, 'foo'), fn.foo);
      assert.deepStrictEqual(get(fn, 'foo.bar'), 1);

      const f3 = { foo: null };
      assert.deepStrictEqual(get(f3, 'foo.bar'), undefined);
      assert.deepStrictEqual(get(f3, 'foo.bar', 'some value'), 'some value');

      assert.deepStrictEqual(get({ 'foo.baz': { bar: true } }, 'foo\\.baz.bar'), true);
      assert.deepStrictEqual(get({ 'fo.ob.az': { bar: true } }, 'fo\\.ob\\.az.bar'), true);

      assert.deepStrictEqual(get(null, 'foo.bar', false), false);
      assert.deepStrictEqual(get('foo', 'foo.bar', false), false);
      assert.deepStrictEqual(get([], 'foo.bar', false), false);
      assert.deepStrictEqual(get(undefined, 'foo.bar', false), false);
    });

    it('should use a custom options.isValid function', function() {
      const isEnumerable = Object.prototype.propertyIsEnumerable;
      const options = {
        isValid: (key, obj) => isEnumerable.call(obj, key)
      };

      const target = {};
      Object.defineProperty(target, 'foo', {
        value: 'bar',
        enumerable: false
      });

      assert.deepStrictEqual(get(target, 'foo', options), undefined);
      assert.deepStrictEqual(get({}, 'hasOwnProperty', options), undefined);
    });

    it('should return a default value', function() {
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake'), undefined);
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2'), undefined);
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2', 'some value'), 'some value');
    });

    it('should pass all of the dot-prop tests', function() {
      const f1 = { foo: { bar: 1 } };
      assert.deepStrictEqual(get(f1), f1);
      assert.deepStrictEqual(get(f1, 'foo'), f1.foo);
      assert.deepStrictEqual(get({ foo: 1 }, 'foo'), 1);
      assert.deepStrictEqual(get({ foo: null }, 'foo'), null);
      assert.deepStrictEqual(get({ foo: undefined }, 'foo'), undefined);
      assert.deepStrictEqual(get({ foo: { bar: true } }, 'foo.bar'), true);
      assert.deepStrictEqual(get({ foo: { bar: { baz: true } } }, 'foo.bar.baz'), true);
      assert.deepStrictEqual(get({ foo: { bar: { baz: null } } }, 'foo.bar.baz'), null);
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2'), undefined);
    });
  });
};
