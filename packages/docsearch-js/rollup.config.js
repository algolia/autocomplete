import { plugins } from '../../rollup.base.config';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name: 'docsearch',
  },
  plugins,
};
