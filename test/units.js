const assert = require('assert/strict');

module.exports = get => {
  describe('get value:', () => {
    it('should return non-object when given as the first argument', () => {
      assert.deepStrictEqual(get(null), null);
      assert.deepStrictEqual(get('foo'), 'foo');
      assert.deepStrictEqual(get(['a']), ['a']);
    });

    it('should get a value', () => {
      assert.deepStrictEqual(get({ a: 'a', b: { c: 'd' } }, 'a'), 'a');
      assert.deepStrictEqual(get({ a: 'a', b: { c: 'd' } }, 'b.c'), 'd');
      assert.deepStrictEqual(get({ foo: 'bar' }, 'foo.bar'), undefined);
    });

    it('should get a property that has dots in the key', () => {
      assert.deepStrictEqual(get({ 'a.b': 'c' }, 'a.b'), 'c');
    });

    it('should support using dot notation to get nested values', () => {
      const fixture = {
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

    it('should support a custom separator on options.separator', () => {
      const fixture = { 'a.b': { c: { d: 'e' } } };
      assert.strictEqual(get(fixture, 'a.b/c/d', { separator: '/' }), 'e');
      assert.strictEqual(get(fixture, 'a\\.b.c.d', { separator: /\\?\./ }), 'e');
    });

    it('should support a custom split function', () => {
      const fixture = { 'a.b': { c: { d: 'e' } } };
      assert.strictEqual(get(fixture, 'a.b/c/d', { split: path => path.split('/') }), 'e');
      assert.strictEqual(get(fixture, 'a\\.b.c.d', { split: path => path.split(/\\?\./) }), 'e');
    });

    it('should support a custom join character', () => {
      const fixture = { 'a-b': { c: { d: 'e' } } };
      const options = { joinChar: '-' };
      assert.strictEqual(get(fixture, 'a.b.c.d', options), 'e');
    });

    it('should support a custom join function', () => {
      const fixture = { 'a-b': { c: { d: 'e' } } };
      const options = {
        split: path => path.split(/[-\/]/),
        join: segs => segs.join('-')
      };
      assert.strictEqual(get(fixture, 'a/b-c/d', options), 'e');
    });

    it('should support a default value as the last argument', () => {
      const fixture = { foo: { c: { d: 'e' } } };
      assert.equal(get(fixture, 'foo.bar.baz', 'quz'), 'quz');
      assert.equal(get(fixture, 'foo.bar.baz', true), true);
      assert.equal(get(fixture, 'foo.bar.baz', false), false);
      assert.equal(get(fixture, 'foo.bar.baz', null), null);
    });

    it('should support options.default', () => {
      const fixture = { foo: { c: { d: 'e' } } };
      assert.equal(get(fixture, 'foo.bar.baz', { default: 'qux' }), 'qux');
      assert.equal(get(fixture, 'foo.bar.baz', { default: true }), true);
      assert.equal(get(fixture, 'foo.bar.baz', { default: false }), false);
      assert.equal(get(fixture, 'foo.bar.baz', { default: null }), null);
      assert.deepStrictEqual(get(fixture, 'foo.bar.baz', { default: { one: 'two' } }), { one: 'two' });
    });

    it('should support a custom function for validating the object', () => {
      const isEnumerable = Object.prototype.propertyIsEnumerable;
      const options = {
        isValid(key, obj) {
          return isEnumerable.call(obj, key);
        }
      };

      const fixture = { 'a.b': { c: { d: 'e' } } };
      assert.strictEqual(get(fixture, 'a.b.c.d', options), 'e');
    });

    it('should support nested keys with dots', () => {
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

    it('should support return default when options.isValid returns false', () => {
      const fixture = { foo: { bar: { baz: 'qux' }, 'a.b.c': 'xyx', yyy: 'zzz' } };
      const options = val => {
        return Object.assign(
          {},
          {
            default: val,
            isValid(key) {
              return key !== 'bar' && key !== 'a.b.c';
            }
          }
        );
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

    it('should get a value from an array', () => {
      const fixture = {
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

    it('should get a value from an object in an array', () => {
      assert.strictEqual(get({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'), 'd');
      assert.strictEqual(get({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'), 'f');
    });

    it('should return `undefined` if the path is not found', () => {
      const fixture = { a: { b: {} } };
      assert.strictEqual(get(fixture, 'a.b.c'), undefined);
      assert.strictEqual(get(fixture, 'a.b.c.d'), undefined);
    });

    it('should get the specified property', () => {
      assert.deepStrictEqual(get({ a: 'aaa', b: 'b' }, 'a'), 'aaa');
      assert.deepStrictEqual(get({ first: 'Jon', last: 'Schlinkert' }, 'first'), 'Jon');
      assert.deepStrictEqual(get({ locals: { a: 'a' }, options: { b: 'b' } }, 'locals'), { a: 'a' });
    });

    it('should support passing a property formatted as an array', () => {
      assert.deepStrictEqual(get({ a: 'aaa', b: 'b' }, ['a']), 'aaa');
      assert.deepStrictEqual(get({ a: { b: { c: 'd' } } }, ['a', 'b', 'c']), 'd');
      assert.deepStrictEqual(get({ first: 'Harry', last: 'Potter' }, ['first']), 'Harry');
      assert.deepStrictEqual(get({ locals: { a: 'a' }, options: { b: 'b' } }, ['locals']), { a: 'a' });
    });

    it('should support escaped dots', () => {
      assert.deepStrictEqual(get({ 'a.b': 'a', b: { c: 'd' } }, 'a\\.b'), 'a');
      assert.deepStrictEqual(get({ 'a.b': { b: { c: 'd' } } }, 'a\\.b.b.c'), 'd');
    });

    it('should get the value of a deeply nested property', () => {
      assert.strictEqual(get({ a: { b: 'c', c: { d: 'e', e: 'f', g: { h: 'i' } } } }, 'a.c.g.h'), 'i');
    });

    it('should return the entire object if no property is passed', () => {
      assert.deepStrictEqual(get({ a: 'a', b: { c: 'd' } }), { a: 'a', b: { c: 'd' } });
    });
  });

  /**
   * These tests are from the "dot-prop" library
   */

  describe('dot-prop tests:', () => {
    it('should pass dot-prop tests', () => {
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

    it('should use a custom options.isValid function', () => {
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

    it('should return a default value', () => {
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake'), undefined);
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2'), undefined);
      assert.deepStrictEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2', 'some value'), 'some value');
    });

    it('should pass all of the dot-prop tests', () => {
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

  /**
   * These tests are from the "object-path" library
   */

  describe('object-path .get tests', () => {
    function getTestObj() {
      return {
        a: 'b',
        b: {
          c: [],
          d: ['a', 'b'],
          e: [{}, { f: 'g' }],
          f: 'i'
        }
      };
    }

    it('should return the value using unicode key', () => {
      const obj = { '15\u00f8C': { '3\u0111': 1 } };
      assert.equal(get(obj, '15\u00f8C.3\u0111'), 1);
      assert.equal(get(obj, ['15\u00f8C', '3\u0111']), 1);
    });

    it('should return the value using dot in key (with array of segments)', () => {
      const obj = { 'a.b': { 'looks.like': 1 } };
      assert.equal(get(obj, ['a.b', 'looks.like']), 1);
    });

    // object-path fails this test
    it('should return the value using dot in key', () => {
      const obj = { 'a.b': { 'looks.like': 1 } };
      assert.equal(get(obj, 'a.b.looks.like'), 1);
    });

    it('should return the value under shallow object', () => {
      const obj = getTestObj();
      assert.equal(get(obj, 'a'), 'b');
      assert.equal(get(obj, ['a']), 'b');
    });

    it('should work with number path', () => {
      const obj = getTestObj();
      assert.equal(get(obj.b.d, 0), 'a');
      assert.equal(get(obj.b, 0), undefined);
    });

    it('should return the value under deep object', () => {
      const obj = getTestObj();
      assert.equal(get(obj, 'b.f'), 'i');
      assert.equal(get(obj, ['b', 'f']), 'i');
    });

    it('should return the value under array', () => {
      const obj = getTestObj();
      assert.equal(get(obj, 'b.d.0'), 'a');
      assert.equal(get(obj, ['b', 'd', 0]), 'a');
    });

    it('should return the value under array deep', () => {
      const obj = getTestObj();
      assert.equal(get(obj, 'b.e.1.f'), 'g');
      assert.equal(get(obj, ['b', 'e', 1, 'f']), 'g');
    });

    it('should return undefined for missing values under object', () => {
      const obj = getTestObj();
      assert.equal(get(obj, 'a.b'), undefined);
      assert.equal(get(obj, ['a', 'b']), undefined);
    });

    it('should return undefined for missing values under array', () => {
      const obj = getTestObj();
      assert.equal(get(obj, 'b.d.5'), undefined);
      assert.equal(get(obj, ['b', 'd', '5']), undefined);
    });

    it('should return the value under integer-like key', () => {
      const obj = { '1a': 'foo' };
      assert.equal(get(obj, '1a'), 'foo');
      assert.equal(get(obj, ['1a']), 'foo');
    });

    it('should return the default value when the key doesnt exist', () => {
      const obj = { '1a': 'foo' };
      assert.equal(get(obj, '1b', null), null);
      assert.equal(get(obj, ['1b'], null), null);
    });

    // this test differs from behavior in object-path. I was unable to figure
    // out exactly how the default values work in object-path.
    it('should return the default value when path is empty', () => {
      const obj = { '1a': 'foo' };
      assert.deepStrictEqual(get(obj, '', null), null);
      assert.deepStrictEqual(get(obj, []), undefined);
      assert.equal(get({}, ['1'], 'foo'), 'foo');
    });

    it('should return the default value when object is null or undefined', () => {
      assert.deepStrictEqual(get(null, 'test', 'a'), 'a');
      assert.deepStrictEqual(get(undefined, 'test', 'a'), 'a');
    });

    it('should not fail on an object with a null prototype', function assertSuccessForObjWithNullProto() {
      const foo = 'FOO';
      const objWithNullProto = Object.create(null);
      objWithNullProto.foo = foo;
      assert.equal(get(objWithNullProto, 'foo'), foo);
    });

    // this differs from object-path, which does not allow
    // the user to get non-own properties for some reason.
    it('should get non-"own" properties on function classes', () => {
      const Base = function() {};

      Base.prototype = {
        one: {
          two: true
        }
      };

      const Extended = function() {
        Base.call(this, true);
      };

      Extended.prototype = Object.create(Base.prototype);

      const extended = new Extended();

      assert.equal(get(extended, 'one.two'), true);
      assert.equal(get(extended, ['one', 'two']), true);
      extended.enabled = true;

      assert.equal(get(extended, 'enabled'), true);
      assert.deepStrictEqual(get(extended, 'one'), { two: true });
    });

    // this differs from object-path, which does not allow
    // the user to get non-own properties for some reason.
    it('should get non-"own" properties on classes', () => {
      class Base {
        one = { two: true };
      }

      class Extended extends Base {}

      const extended = new Extended();

      assert.equal(get(extended, 'one.two'), true);
      assert.equal(get(extended, ['one', 'two']), true);
      extended.enabled = true;

      assert.equal(get(extended, 'enabled'), true);
      assert.deepStrictEqual(get(extended, 'one'), { two: true });
    });
  });

  describe('deep-property unit tests', () => {
    it('should handle invalid input', () => {
      const a = undefined;
      const b = {};

      assert.equal(get(a, 'sample'), undefined);
      assert.deepStrictEqual(get(b, undefined), {});
      assert.deepStrictEqual(get(b, ''), undefined);
      assert.deepStrictEqual(get(b, '...'), undefined);
    });

    it('should get shallow properties', () => {
      const fn = () => {};
      const a = {
        sample: 'string',
        example: fn,
        unknown: undefined
      };

      assert.equal(get(a, 'example'), fn);
      assert.equal(get(a, 'sample'), 'string');
      assert.equal(get(a, 'unknown'), undefined);
      assert.equal(get(a, 'invalid'), undefined);
    });

    it('should get deep properties', () => {
      const a = {
        b: { example: { type: 'vegetable' } },
        c: { example: { type: 'mineral' } }
      };

      assert.equal(get(a, 'b.example.type'), 'vegetable');
      assert.equal(get(a, 'c.example.type'), 'mineral');
      assert.equal(get(a, 'c.gorky.type'), undefined);
    });

    it('should get properties on non-objects', () => {
      const fn = () => {};

      // the commented out lines are from from the "deep-property" lib,
      // but it's invalid javascript. This is a good example of why it's always
      // better to use "use strict" (and lint your code).

      // const str = 'An example string';
      // const num = 42;

      fn.path = { to: { property: 'string' } };
      // str.path = { to: { property: 'string' } };
      // num.path = { to: { property: 'string' } };

      assert.equal(get(fn, 'path.to.property'), 'string');
      // assert.equal(get(str, 'path.to.property'), undefined);
      // assert.equal(get(num, 'path.to.property'), undefined);
    });
  });
};
