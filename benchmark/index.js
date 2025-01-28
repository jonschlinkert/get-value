const path = require('path');
const bench = require('benchmarked');
const write = require('write');
const render = require('./render');

bench.run({ fixtures: 'fixtures/{deep,root,shallow}.js', code: 'code/libs/*.js' })
  .then(stats => {
    write.sync(path.join(__dirname, 'stats.json'), JSON.stringify(stats, null, 2));
    write.sync(path.join(__dirname, 'stats.md'), render(stats));
  })
  .catch(console.error);
