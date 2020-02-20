import json from '@rollup/plugin-json';

import { name } from './package.json';
import { sharedPlugins } from '../autocomplete-core/rollup.config';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name,
    sourcemap: true,
  },
  plugins: [json(), ...sharedPlugins],
};
