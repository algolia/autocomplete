/* eslint-disable import/no-commonjs */

const { version } = require('./package.json');

module.exports = api => {
  const isTest = api.env('test');
  const modules = isTest ? 'commonjs' : false;
  const targets = {};

  if (isTest) {
    targets.node = true;
  } else {
    targets.browsers = ['last 2 versions', 'ie >= 9'];
  }

  return {
    ignore: ['**/__tests__/**/*', '**/__mocks__/**/*', '**/__fixtures__/**/*'],
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
    plugins: [
      !isTest && [
        // When testing, __DEV__ is replaced by Jest(jest.config.js)
        'inline-replace-variables',
        {
          __DEV__: {
            type: 'node',
            replacement: "process.env.NODE_ENV === 'development'",
          },
          __VERSION__: {
            type: 'node',
            replacement: JSON.stringify(version),
          },
        },
      ],
    ],
  };
};
