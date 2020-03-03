import json from '@rollup/plugin-json';

import { name } from './package.json';
import { sharedPlugins } from '../autocomplete-core/rollup.config';

export default {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
  plugins: [json(), ...sharedPlugins],
};
