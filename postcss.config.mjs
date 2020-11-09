import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import sass from 'postcss-node-sass';

export default {
  plugins: [autoprefixer, sass, cssnano],
};
