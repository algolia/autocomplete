import { plugins } from '../../rollup.base.config';

import { name } from './package.json';

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
  plugins,
};
