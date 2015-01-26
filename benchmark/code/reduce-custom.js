
var reduce = require('arr-reduce');

module.exports = function get(obj, path) {
  if (obj == null) return {};
  if (path == null) return obj;

  return reduce(path.split('.'), function(prev, curr) {
    return prev && prev[curr];
  }, obj);
};