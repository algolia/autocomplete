import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from 'rollup-plugin-babel';
import filesize from 'rollup-plugin-filesize';

import { name } from './package.json';

export const sharedPlugins = [
  replace({
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  }),
  resolve({
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  }),
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
