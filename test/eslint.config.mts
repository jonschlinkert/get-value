import globals from 'globals';
import { defineConfig } from 'eslint/config';
import rootConfig from '../eslint.config.mts';

// pnpm i -D eslint@latest globals@latest

export default defineConfig([
  {
    extends: [rootConfig],
    languageOptions: {
      globals: {
        ...globals.mocha
      }
    }
  }
]);
