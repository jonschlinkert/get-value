import fs from 'node:fs';
import path from 'node:path';
import minimist from 'minimist';
import mm from 'micromatch';
import units from './units';
import getValue from '..';

const argv = minimist(process.argv.slice(2));
const cwd = path.join.bind(path, __dirname, '../benchmark/code');

const files = pattern => {
  const paths = fs.globSync('**/*.js', { cwd: cwd() });
  console.log(paths);
  return mm(paths, `libs/${pattern}.js`).map(f => cwd(f));
};

if (argv.bench) {
  files(argv.bench).forEach(file => units(require(file)));
  return;
}

units(getValue?.default || getValue);
