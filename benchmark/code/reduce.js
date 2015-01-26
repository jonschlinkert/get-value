
module.exports = function get(obj, path) {
  if (obj == null) return {};
  if (path == null) return obj;

  return path.split('.').reduce(function(prev, curr) {
    return prev && prev[curr];
  }, obj);
};
