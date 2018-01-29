const get = require('..');
const isEnumerable = Object.prototype.propertyIsEnumerable;
const options = {
  isValid: (key, obj) => isEnumerable.call(obj, key)
};

const obj = {};
Object.defineProperty(obj, 'foo', { value: 'bar', enumerable: false });

console.log(get(obj, 'foo', options));           //=> undefined
console.log(get({}, 'hasOwnProperty', options)); //=> undefined
console.log(get({}, 'constructor', options));    //=> undefined
