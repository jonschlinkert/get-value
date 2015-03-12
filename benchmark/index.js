'use strict';

var Suite = require('benchmarked');

var suite = new Suite({
  expected: true,
  fixtures: 'fixtures/{deep,sh*}.js',
  add: 'code/{dot*,current,geto*}.js',
  cwd: __dirname
});
suite.run();
