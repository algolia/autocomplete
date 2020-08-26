import { plugins } from '../../rollup.base.config';
import { getBundleBanner } from '../../scripts/getBundleBanner';

import pkg from './package.json';

if (!process.env.BUILD) {
  throw new Error('The `BUILD` environment variable is required to build.');
}

const output = {
  umd: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name: 'docsearch',
    banner: getBundleBanner(pkg),
  },
  esm: {
    file: 'dist/esm/index.js',
    format: 'es',
    sourcemap: true,
    banner: getBundleBanner(pkg),
  },
};

export default {
  input: 'src/index.ts',
  output: output[process.env.BUILD],
  plugins,
};
