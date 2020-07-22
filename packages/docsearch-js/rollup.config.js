import { plugins } from '../../rollup.base.config';

if (!process.env.BUILD) {
  throw new Error('The `BUILD` environment variable is required to build.');
}

const output = {
  umd: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name: 'docsearch',
  },
  esm: {
    file: 'dist/esm/index.js',
    format: 'es',
    sourcemap: true,
  },
};

export default {
  input: 'src/index.ts',
  output: output[process.env.BUILD],
  plugins,
};
