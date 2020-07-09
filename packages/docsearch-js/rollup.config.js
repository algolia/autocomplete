import json from '@rollup/plugin-json';
import alias from '@rollup/plugin-alias';

import { sharedPlugins } from '../autocomplete-core/rollup.config';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name: 'docsearch',
  },
  plugins: [
    json(),
    alias({
      entries: [
        { find: 'react', replacement: 'preact/compat' },
        { find: 'react-dom', replacement: 'preact/compat' },
      ],
    }),
    ...sharedPlugins,
  ],
};
