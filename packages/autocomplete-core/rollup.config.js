import { name } from './package.json';
import { plugins } from '../../rollup.base.config';

if (process.env.NODE_ENV === 'production' && !process.env.VERSION) {
  throw new Error(
    `You need to specify a valid semver environment variable 'VERSION' to run the build process (received: ${JSON.stringify(
      process.env.VERSION
    )}).`
  );
}

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name,
  },
  plugins,
};
