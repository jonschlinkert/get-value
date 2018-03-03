'use strict';

const path = require('path');
const bench = require('benchmarked');
const write = require('write');

bench.run({fixtures: 'fixtures/{deep,root,shallow,escaped}.js', code: 'code/{dot*,get-value}.js'})
  .then(function(stats) {
    write.sync(path.join(__dirname, 'stats.json'), JSON.stringify(stats, null, 2))
    write.sync(path.join(__dirname, 'stats.md'), bench.render(stats));
  })
  .catch(console.error);
