import cssnano from 'cssnano';
import sass from 'postcss-node-sass';

export default {
  plugins: [sass, cssnano],
};
