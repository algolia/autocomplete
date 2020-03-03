module.exports = {
  extends: ['algolia', 'algolia/jest', 'algolia/react', 'algolia/typescript'],
  globals: {
    __DEV__: false,
    __VERSION__: false,
  },
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'no-param-reassign': 0,
    'valid-jsdoc': 0,
    'no-shadow': 0,
    'prefer-template': 0,
    'jest/no-disabled-tests': 0,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'import/extensions': 0,
    '@typescript-eslint/camelcase': ['error', { allow: ['__autocomplete_id'] }],
    // Useful to call functions like `nodeItem?.scrollIntoView()`.
    'no-unused-expressions': 0,
  },
  overrides: [
    {
      files: ['**/rollup.config.js', 'stories/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
