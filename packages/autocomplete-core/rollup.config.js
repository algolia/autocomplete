import { plugins } from '../../rollup.base.config';
import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name: pkg.name,
    banner: getBundleBanner(pkg),
  },
  plugins,
};
