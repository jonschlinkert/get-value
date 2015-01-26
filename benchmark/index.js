'use strict';

var Suite = require('benchmarked');

var suite = new Suite({
  expected: true,
  fixtures: 'fixtures/{deep,sh*}.js',
  add: 'code/{while,current}.js',
  cwd: __dirname
});
suite.run();
