const wrapWarningWithDevCheck = require('./scripts/babel/wrap-warning-with-dev-check');

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
        '@babel/preset-react',
        { pragma: 'createElement', pragmaFrag: 'Fragment' },
      ],
      [
        '@babel/preset-env',
        {
          modules,
          targets,
        },
      ],
    ],
    plugins: clean([
      wrapWarningWithDevCheck,
      [
        'inline-replace-variables',
        {
          __DEV__: {
            type: 'node',
            replacement: "process.env.NODE_ENV !== 'production'",
          },
          __TEST__: {
            type: 'node',
            replacement: "process.env.NODE_ENV === 'test'",
          },
        },
      ],
    ]),
  };
};

function clean(config) {
  return config.filter(Boolean);
}
