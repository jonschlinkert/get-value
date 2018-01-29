'use strict';

const bench = require('benchmarked');

bench.run({fixtures: 'fixtures/{deep,root,shallow,escaped}.js', code: 'code/{dot*,get-value}.js'})
  .then(function() {
    console.log(arguments);
  });
