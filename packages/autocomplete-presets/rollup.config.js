import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import { name } from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      name,
      sourcemap: true,
    },
    plugins: [
      replace({
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
      }),
      resolve({
        extensions: ['.js', '.ts', '.json'],
      }),
      json(),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts', '.json'],
      }),
    ],
  },
];
