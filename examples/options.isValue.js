import getValue from '..';
const isEnumerable = Object.prototype.propertyIsEnumerable;
const options = {
  isValid: (key, obj) => isEnumerable.call(obj, key)
};

const obj = {};
Object.defineProperty(obj, 'foo', { value: 'bar', enumerable: false });

console.log(getValue(obj, 'foo', options)); //=> undefined
console.log(getValue({}, 'hasOwnProperty', options)); //=> undefined
console.log(getValue({}, 'constructor', options)); //=> undefined
