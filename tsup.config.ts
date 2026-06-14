import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  entry: ['index.ts'],
  cjsInterop: true,
  dts: true,
  format: ['cjs', 'esm'],
  keepNames: true,
  minify: false,
  shims: true,
  splitting: false,
  sourcemap: true,
  target: `node${process.version.slice(1).split('.')[0]}`
});
