const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const glob = require('glob');
const mm = require('micromatch');
const units = require('./units');
const cwd = path.join.bind(path, __dirname, '../benchmark/code');
const getValue = require('..');

const files = pattern => {
  const paths = glob.sync('**/*.js', { cwd: cwd() });
  return mm(paths, `{,libs/}${pattern}{,.js}`).map(f => cwd(f));
};

if (argv.bench) {
  files(argv.bench).forEach(file => units(require(file)));
  return;
}

units(getValue?.default || getValue);
