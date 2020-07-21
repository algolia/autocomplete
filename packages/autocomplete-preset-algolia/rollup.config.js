import { name } from './package.json';
import { plugins } from '../../rollup.base.config';

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
