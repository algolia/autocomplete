module.exports = {
  rootDir: process.cwd(),
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './scripts/jest/setupTests.ts',
  ],
  testPathIgnorePatterns: ['node_modules/', 'dist/', 'cypress/'],
  coveragePathIgnorePatterns: ['node_modules/', 'dist/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  globals: {
    __DEV__: true,
    __TEST__: true,
  },
  moduleNameMapper: {
    '^@algolia/autocomplete-(.*)$': '<rootDir>/packages/autocomplete-$1/src/',
  },
};
