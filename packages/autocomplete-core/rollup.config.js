import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';

import { name } from './package.json';

if (process.env.NODE_ENV === 'production' && !process.env.VERSION) {
  throw new Error(
    `You need to specify a valid semver environment variable 'VERSION' to run the build process (received: ${JSON.stringify(
      process.env.VERSION
    )}).`
  );
}

export const sharedPlugins = [
  replace({
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __VERSION__: JSON.stringify(process.env.VERSION),
  }),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    rootMode: 'upward',
  }),
  terser(),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/umd/index.js',
    format: 'umd',
    sourcemap: true,
    name,
  },
  plugins: [...sharedPlugins],
};
