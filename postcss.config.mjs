import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import color from 'postcss-color-rgb';
import comment from 'postcss-comment';
import sass from '@csstools/postcss-sass';
import presetEnv from 'postcss-preset-env';

export default {
  parser: comment,
  plugins: [
    presetEnv({
      features: {
        'nesting-rules': false,
      },
    }),
    color,
    sass,
    autoprefixer,
    cssnano,
  ],
};
