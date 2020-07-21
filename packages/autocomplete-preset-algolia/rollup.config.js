import { plugins } from '../../rollup.base.config';

import { name } from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    name,
    sourcemap: true,
  },
  plugins,
};
