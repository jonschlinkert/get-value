import assert from 'node:assert/strict';

export default get => {
  describe('get value:', () => {
    it('should return non-object when given as the first argument', () => {
      assert.equal(get(null), null);
      assert.equal(get('foo'), 'foo');
      assert.deepEqual(get(['a']), ['a']);
    });

    it('should get a value', () => {
      assert.equal(get({ a: 'a', b: { c: 'd' } }, 'a'), 'a');
      assert.equal(get({ a: 'a', b: { c: 'd' } }, 'b.c'), 'd');
      assert.equal(get({ foo: 'bar' }, 'foo.zed'), undefined);
    });

    it('should get a direct key from a Map', () => {
      assert.equal(get(new Map([['foo', 'bar']]), 'foo'), 'bar');
    });

    it('should get nested keys from Maps', () => {
      const fixture = new Map([['foo', new Map([['bar', 'baz']])]]);
      assert.equal(get(fixture, 'foo.bar'), 'baz');
    });

    it('should get values from an object exposing a get function', () => {
      const fixture = {
        get(key) {
          return key === 'foo' ? { bar: 'baz' } : undefined;
        }
      };

      assert.equal(get(fixture, 'foo.bar'), 'baz');
    });

    it('should get a property that has dots in the key', () => {
      assert.equal(get({ 'a.b': 'c' }, 'a.b'), 'c');
    });

    it('should support using dot notation to get nested values', () => {
      const fixture = {
        a: { locals: { name: { first: 'Brian' } } },
        b: { locals: { name: { last: 'Woodward' } } },
        c: { locals: { paths: ['a.txt', 'b.js', 'c.hbs'] } }
      };
      assert.deepEqual(get(fixture, 'a.locals.name'), { first: 'Brian' });
      assert.deepEqual(get(fixture, 'b.locals.name'), { last: 'Woodward' });
      assert.equal(get(fixture, 'b.locals.name.last'), 'Woodward');
      assert.equal(get(fixture, 'c.locals.paths.0'), 'a.txt');
      assert.equal(get(fixture, 'c.locals.paths.1'), 'b.js');
      assert.equal(get(fixture, 'c.locals.paths.2'), 'c.hbs');
    });

    it('should support a custom separator on options.separator', () => {
      const fixture = { 'a.b': { c: { d: 'e' } } };
      assert.equal(get(fixture, 'a.b/c/d', { separator: '/' }), 'e');
      assert.equal(get(fixture, 'a\\.b.c.d', { separator: /\\?\./ }), 'e');
    });

    it('should support a custom split function', () => {
      const fixture = { 'a.b': { c: { d: 'e' } } };
      assert.equal(get(fixture, 'a.b/c/d', { split: path => path.split('/') }), 'e');
      assert.equal(get(fixture, 'a\\.b.c.d', { split: path => path.split(/\\?\./) }), 'e');
    });

    it('should support a custom join character', () => {
      const fixture = { 'a-b': { c: { d: 'e' } } };
      const options = { joinChar: '-' };
      assert.equal(get(fixture, 'a.b.c.d', options), 'e');
    });

    it('should support a custom join function', () => {
      const fixture = { 'a-b': { c: { d: 'e' } } };
      const options = {
        split: path => path.split(/[-\/]/),
        join: segs => segs.join('-')
      };
      assert.equal(get(fixture, 'a/b-c/d', options), 'e');
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
      assert.deepEqual(get(fixture, 'foo.bar.baz', { default: { one: 'two' } }), { one: 'two' });
    });

    it('should support a custom function for validating the object', () => {
      const isEnumerable = Object.prototype.propertyIsEnumerable;
      const options = {
        isValid(key, obj) {
          return isEnumerable.call(obj, key);
        }
      };

      const fixture = { 'a.b': { c: { d: 'e' } } };
      assert.equal(get(fixture, 'a.b.c.d', options), 'e');
    });

    it('should support nested keys with dots', () => {
      assert.equal(get({ 'a.b.c': 'd' }, 'a.b.c'), 'd');
      assert.equal(get({ 'a.b': { c: 'd' } }, 'a.b.c'), 'd');
      assert.equal(get({ 'a.b': { c: { d: 'e' } } }, 'a.b.c.d'), 'e');
      assert.equal(get({ a: { b: { c: 'd' } } }, 'a.b.c'), 'd');
      assert.equal(get({ a: { 'b.c': 'd' } }, 'a.b.c'), 'd');
      assert.equal(get({ 'a.b.c.d': 'e' }, 'a.b.c.d'), 'e');
      assert.equal(get({ 'a.b.c.d': 'e' }, 'a.b.c'), undefined);

      assert.equal(get({ 'a.b.c.d.e.f': 'g' }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b.c.d.e': { f: 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b.c.d': { e: { f: 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b.c': { d: { e: { f: 'g' } } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b': { c: { d: { e: { f: 'g' } } } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ a: { b: { c: { d: { e: { f: 'g' } } } } } }, 'a.b.c.d.e.f'), 'g');

      assert.deepEqual(get({ 'a.b.c.d.e': { f: 'g' } }, 'a.b.c.d.e'), { f: 'g' });
      assert.deepEqual(get({ 'a.b.c.d': { 'e.f': 'g' } }, 'a.b.c.d.e'), undefined);
      assert.deepEqual(get({ 'a.b.c': { 'd.e.f': 'g' } }, 'a.b.c'), { 'd.e.f': 'g' });
      assert.deepEqual(get({ 'a.b': { 'c.d.e.f': 'g' } }, 'a.b'), { 'c.d.e.f': 'g' });
      assert.deepEqual(get({ a: { 'b.c.d.e.f': 'g' } }, 'a'), { 'b.c.d.e.f': 'g' });

      assert.equal(get({ 'a.b.c.d.e': { f: 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b.c.d': { 'e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b.c': { 'd.e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b': { 'c.d.e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ a: { 'b.c.d.e.f': 'g' } }, 'a.b.c.d.e.f'), 'g');

      assert.equal(get({ 'a.b': { 'c.d': { 'e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ 'a.b': { c: { 'd.e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ a: { 'b.c.d.e': { f: 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ a: { 'b.c.d': { 'e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ a: { 'b.c': { 'd.e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
      assert.equal(get({ a: { b: { 'c.d.e.f': 'g' } } }, 'a.b.c.d.e.f'), 'g');
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
      assert.equal(get(fixture, 'a.paths.0'), 'a.txt');
      assert.equal(get(fixture, 'a.paths.1'), 'a.js');
      assert.equal(get(fixture, 'a.paths.2'), 'a.hbs');

      assert.equal(get(fixture, 'b.paths.0'), 'b.txt');
      assert.equal(get(fixture, 'b.paths.1'), 'b.js');
      assert.equal(get(fixture, 'b.paths.2'), 'b.hbs');
      assert.equal(get(fixture, 'b.paths.3'), 'b3.hbs');
    });

    it('should get a value from an object in an array', () => {
      assert.equal(get({ a: { b: [{ c: 'd' }] } }, 'a.b.0.c'), 'd');
      assert.equal(get({ a: { b: [{ c: 'd' }, { e: 'f' }] } }, 'a.b.1.e'), 'f');
    });

    it('should return `undefined` if the path is not found', () => {
      const fixture = { a: { b: {} } };
      assert.equal(get(fixture, 'a.b.c'), undefined);
      assert.equal(get(fixture, 'a.b.c.d'), undefined);
    });

    it('should get the specified property', () => {
      assert.deepEqual(get({ a: 'aaa', b: 'b' }, 'a'), 'aaa');
      assert.deepEqual(get({ first: 'Jon', last: 'Schlinkert' }, 'first'), 'Jon');
      assert.deepEqual(get({ locals: { a: 'a' }, options: { b: 'b' } }, 'locals'), { a: 'a' });
    });

    it('should support passing a property formatted as an array', () => {
      assert.deepEqual(get({ a: 'aaa', b: 'b' }, ['a']), 'aaa');
      assert.deepEqual(get({ a: { b: { c: 'd' } } }, ['a', 'b', 'c']), 'd');
      assert.deepEqual(get({ first: 'Harry', last: 'Potter' }, ['first']), 'Harry');
      assert.deepEqual(get({ locals: { a: 'a' }, options: { b: 'b' } }, ['locals']), { a: 'a' });
    });

    it('should support escaped dots', () => {
      assert.deepEqual(get({ 'a.b': 'a', b: { c: 'd' } }, 'a\\.b'), 'a');
      assert.deepEqual(get({ 'a.b': { b: { c: 'd' } } }, 'a\\.b.b.c'), 'd');
    });

    it('should get the value of a deeply nested property', () => {
      assert.equal(get({ a: { b: 'c', c: { d: 'e', e: 'f', g: { h: 'i' } } } }, 'a.c.g.h'), 'i');
    });

    it('should return the entire object if no property is passed', () => {
      assert.deepEqual(get({ a: 'a', b: { c: 'd' } }), { a: 'a', b: { c: 'd' } });
    });
  });

  /**
   * These tests are from the "dot-prop" library
   */

  describe('dot-prop tests:', () => {
    it('should pass dot-prop tests', () => {
      const f1 = { foo: { bar: 1 } };
      assert.deepEqual(get(f1), f1);
      f1[''] = 'foo';
      assert.deepEqual(get(f1, ''), 'foo');
      assert.deepEqual(get(f1, 'foo'), f1.foo);
      assert.deepEqual(get({ foo: 1 }, 'foo'), 1);
      assert.deepEqual(get({ foo: null }, 'foo'), null);
      assert.deepEqual(get({ foo: undefined }, 'foo'), undefined);
      assert.deepEqual(get({ foo: { bar: true } }, 'foo.bar'), true);
      assert.deepEqual(get({ foo: { bar: { baz: true } } }, 'foo.bar.baz'), true);
      assert.deepEqual(get({ foo: { bar: { baz: null } } }, 'foo.bar.baz'), null);
      assert.deepEqual(get({ '\\': true }, '\\'), true);
      assert.deepEqual(get({ '\\foo': true }, '\\foo'), true);
      assert.deepEqual(get({ 'bar\\': true }, 'bar\\'), true);
      assert.deepEqual(get({ 'foo\\bar': true }, 'foo\\bar'), true);
      assert.deepEqual(get({ '\\.foo': true }, '\\\\.foo'), true);
      assert.deepEqual(get({ 'bar\\.': true }, 'bar\\\\.'), true);
      assert.deepEqual(get({ 'foo\\.bar': true }, 'foo\\\\.bar'), true);
      assert.deepEqual(get({ foo: 1 }, 'foo.bar'), undefined);

      function fn() {}
      fn.foo = { bar: 1 };
      assert.deepEqual(get(fn), fn);
      assert.deepEqual(get(fn, 'foo'), fn.foo);
      assert.deepEqual(get(fn, 'foo.bar'), 1);

      const f3 = { foo: null };
      assert.deepEqual(get(f3, 'foo.bar'), undefined);
      assert.deepEqual(get(f3, 'foo.bar', 'some value'), 'some value');

      assert.deepEqual(get({ 'foo.baz': { bar: true } }, 'foo\\.baz.bar'), true);
      assert.deepEqual(get({ 'fo.ob.az': { bar: true } }, 'fo\\.ob\\.az.bar'), true);

      assert.deepEqual(get(null, 'foo.bar', false), false);
      assert.deepEqual(get('foo', 'foo.bar', false), false);
      assert.deepEqual(get([], 'foo.bar', false), false);
      assert.deepEqual(get(undefined, 'foo.bar', false), false);
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

      assert.deepEqual(get(target, 'foo', options), undefined);
      assert.deepEqual(get({}, 'hasOwnProperty', options), undefined);
    });

    it('should return a default value', () => {
      assert.deepEqual(get({ foo: { bar: 'a' } }, 'foo.fake'), undefined);
      assert.deepEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2'), undefined);
      assert.deepEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2', 'some value'), 'some value');
    });

    it('should pass all of the dot-prop tests', () => {
      const f1 = { foo: { bar: 1 } };
      assert.deepEqual(get(f1), f1);
      assert.deepEqual(get(f1, 'foo'), f1.foo);
      assert.deepEqual(get({ foo: 1 }, 'foo'), 1);
      assert.deepEqual(get({ foo: null }, 'foo'), null);
      assert.deepEqual(get({ foo: undefined }, 'foo'), undefined);
      assert.deepEqual(get({ foo: { bar: true } }, 'foo.bar'), true);
      assert.deepEqual(get({ foo: { bar: { baz: true } } }, 'foo.bar.baz'), true);
      assert.deepEqual(get({ foo: { bar: { baz: null } } }, 'foo.bar.baz'), null);
      assert.deepEqual(get({ foo: { bar: 'a' } }, 'foo.fake.fake2'), undefined);
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
      assert.deepEqual(get(obj, '', null), null);
      assert.deepEqual(get(obj, []), undefined);
      assert.equal(get({}, ['1'], 'foo'), 'foo');
    });

    it('should return the default value when object is null or undefined', () => {
      assert.deepEqual(get(null, 'test', 'a'), 'a');
      assert.deepEqual(get(undefined, 'test', 'a'), 'a');
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
      assert.deepEqual(get(extended, 'one'), { two: true });
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
      assert.deepEqual(get(extended, 'one'), { two: true });
    });
  });

  describe('deep-property unit tests', () => {
    it('should handle invalid input', () => {
      const a = undefined;
      const b = {};

      assert.equal(get(a, 'sample'), undefined);
      assert.deepEqual(get(b, undefined), {});
      assert.deepEqual(get(b, ''), undefined);
      assert.deepEqual(get(b, '...'), undefined);
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
