import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import { terser } from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';
import filesize from 'rollup-plugin-filesize';

import pkg from './package.json';

const algolia = '© Algolia, Inc. and contributors; MIT License';
const link = 'https://github.com/algolia/autocomplete.js';
const banner = `/*! Autocomplete.js ${pkg.version} | ${algolia} | ${link} */`;

const plugins = [
  resolve({
    browser: true,
    preferBuiltins: false,
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  }),
  commonjs({
    namedExports: {
      'react-is': ['isForwardRef'],
    },
  }),
  replace({
    __DEV__: JSON.stringify('production'),
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.ts', '.tsx'],
  }),
  terser(),
  license({
    banner,
  }),
  filesize({
    showMinifiedSize: false,
    showGzippedSize: true,
  }),
];

const configuration = {
  input: pkg.source,
  output: {
    file: pkg['umd:main'],
    name: 'autocomplete',
    format: 'umd',
    sourcemap: true,
  },
  plugins,
};

export default configuration;
