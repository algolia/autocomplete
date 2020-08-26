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
      files: ['**/rollup.config.js', 'stories/**/*', '**/__tests__/**'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['cypress/**/*'],
      plugins: ['cypress'],
      env: {
        'cypress/globals': true,
      },
      rules: {
        'jest/expect-expect': 'off',
        'spaced-comment': 'off',
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
    {
      files: ['scripts/**/*'],
      rules: {
        'import/no-commonjs': 'off',
      },
    },
  ],
};
