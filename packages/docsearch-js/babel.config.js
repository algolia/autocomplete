/* eslint-disable import/no-commonjs */

module.exports = (api) => {
  const isTest = api.env('test');
  const modules = isTest ? 'commonjs' : false;
  const targets = {};

  if (isTest) {
    targets.node = true;
  } else {
    targets.browsers = ['last 2 versions', 'ie >= 11'];
  }

  return {
    presets: [
      '@babel/preset-typescript',
      [
        '@babel/preset-env',
        {
          modules,
          targets,
        },
      ],
    ],
    plugins: [['@babel/plugin-transform-react-jsx']],
  };
};
