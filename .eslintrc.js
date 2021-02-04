module.exports = {
  extends: ['algolia', 'algolia/jest', 'algolia/react', 'algolia/typescript'],
  globals: {
    __DEV__: false,
    __TEST__: false,
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
    curly: 2,
    'no-param-reassign': 0,
    'valid-jsdoc': 0,
    'no-shadow': 0,
    'prefer-template': 0,
    'jest/no-disabled-tests': 0,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 0,
    'new-cap': 0,
    'eslint-comments/disable-enable-pair': ['error', { allowWholeFile: true }],
    'import/extensions': 0,
    '@typescript-eslint/camelcase': [
      'error',
      {
        allow: ['__autocomplete_'],
      },
    ],
    // Useful to call functions like `nodeItem?.scrollIntoView()`.
    'no-unused-expressions': 0,
    complexity: 0,
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        'newlines-between': 'always',
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '@/**/*',
            group: 'parent',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin'],
      },
    ],
  },
  overrides: [
    {
      files: ['test/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
    {
      files: ['packages/autocomplete-js/**/*/setProperties.ts'],
      rules: {
        'eslint-comments/no-unlimited-disable': 0,
      },
    },
    {
      files: ['packages/website/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
    {
      files: ['**/rollup.config.js', 'stories/**/*', '**/__tests__/**'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
    {
      files: ['cypress/**/*'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
      rules: {
        'jest/expect-expect': 0,
        'spaced-comment': 0,
        '@typescript-eslint/triple-slash-reference': 0,
      },
    },
    {
      files: ['scripts/**/*', '*.config.js'],
      rules: {
        'import/no-commonjs': 0,
      },
    },
    {
      files: ['examples/**/*'],
      rules: {
        'spaced-comment': 0,
      },
    },
  ],
};
