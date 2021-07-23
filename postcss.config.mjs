import sass from '@csstools/postcss-sass';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import color from 'postcss-color-rgb';
import comment from 'postcss-comment';
import presetEnv from 'postcss-preset-env';

const MINIFIED = process.env.MINIFIED;
const plugins = [
  presetEnv({
    features: {
      'nesting-rules': false,
    },
  }),
  color,
  sass,
  autoprefixer,
];

export default {
  parser: comment,
  plugins: MINIFIED ? [...plugins, cssnano] : plugins,
};
