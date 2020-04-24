/* eslint-disable import/no-commonjs */

module.exports = (api) => {
  const isTest = api.env('test');
  const modules = isTest ? 'commonjs' : false;
  const targets = {};

  if (isTest) {
    targets.node = true;
  } else {
    targets.browsers = ['last 2 versions', 'ie >= 9'];
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
    plugins: clean([
      '@babel/plugin-transform-react-jsx',
      !isTest && [
        'inline-replace-variables',
        {
          __DEV__: {
            type: 'node',
            replacement: "process.env.NODE_ENV === 'development'",
          },
        },
      ],
    ]),
    overrides: [
      {
        test: 'packages/autocomplete-core',
        plugins: clean([
          !isTest && [
            'inline-replace-variables',
            {
              __DEV__: {
                type: 'node',
                replacement: "process.env.NODE_ENV === 'development'",
              },
              __VERSION__: {
                type: 'node',
                replacement: JSON.stringify(
                  require('./packages/autocomplete-core/package.json').version
                ),
              },
            },
          ],
        ]),
      },
      {
        test: 'packages/autocomplete-preset-algolia',
        plugins: clean([
          !isTest && [
            'inline-replace-variables',
            {
              __DEV__: {
                type: 'node',
                replacement: "process.env.NODE_ENV === 'development'",
              },
              __VERSION__: {
                type: 'node',
                replacement: JSON.stringify(
                  require('./packages/autocomplete-preset-algolia/package.json')
                    .version
                ),
              },
            },
          ],
        ]),
      },
      {
        test: 'packages/autocomplete-react',
        plugins: clean([
          '@babel/plugin-transform-react-jsx',
          !isTest && [
            'inline-replace-variables',
            {
              __DEV__: {
                type: 'node',
                replacement: "process.env.NODE_ENV === 'development'",
              },
              __VERSION__: {
                type: 'node',
                replacement: JSON.stringify(
                  require('./packages/autocomplete-react/package.json').version
                ),
              },
            },
          ],
        ]),
      },
    ],
  };
};

function clean(config) {
  return config.filter(Boolean);
}
