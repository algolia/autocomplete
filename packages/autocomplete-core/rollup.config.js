import resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from '@rollup/plugin-replace';
import { name } from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/umd/index.js',
      format: 'umd',
      sourcemap: true,
      name,
    },
    plugins: [
      replace({
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
      }),
      resolve({
        extensions: ['.js', '.ts'],
      }),
      babel({
        exclude: 'node_modules/**',
        extensions: ['.js', '.ts'],
      }),
    ],
  },
];
