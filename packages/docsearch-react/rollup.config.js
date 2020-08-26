import { plugins } from '../../rollup.base.config';
import { checkIsReleaseReady } from '../scripts/checkIsReleaseReady';
import { getBundleBanner } from '../scripts/getBundleBanner';

import pkg from './package.json';

checkIsReleaseReady();

export default {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: {
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name: pkg.name,
    banner: getBundleBanner(pkg),
  },
  plugins,
};
