/* eslint-disable import/no-commonjs */

module.exports = {
  rootDir: process.cwd(),
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname',
  ],
  globals: {
    __DEV__: true,
    __VERSION__: 'version-test',
  },
};
