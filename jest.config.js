module.exports = {
  rootDir: process.cwd(),
  setupFilesAfterEnv: [
    '@testing-library/jest-dom/extend-expect',
    './scripts/jest/setupTests.ts',
  ],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
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
    '^@algolia/autocomplete-shared/dist/esm/(.*)$':
      '<rootDir>/packages/autocomplete-shared/src/$1',
    '^@algolia/autocomplete-(.*)$': '<rootDir>/packages/autocomplete-$1/src/',
  },
};
