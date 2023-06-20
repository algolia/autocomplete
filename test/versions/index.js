#!/usr/bin/env node
/* eslint-disable no-process-exit, no-console, import/no-commonjs */
const fs = require('fs');
const path = require('path');

// This file does not use any dependencies, so that it can be ran before installing

// It checks whether the versions of packages that should be versioned synchronously
// are actually in sync. We need this as long as Lerna doesn't have a mixed mode.
// see: https://github.com/lerna/lerna/issues/1159

let hasError = false;
const expectedVersion = require('../../lerna.json').version;
const packages = fs.readdirSync(path.join(__dirname, '../../packages'));

const results = packages.map((package) => {
  const version = require(path.join(
    __dirname,
    `../../packages/${package}/package.json`
  )).version;
  return { isValid: version === expectedVersion, package, version };
});

if (results.some(({ isValid }) => !isValid)) {
  console.error(
    [
      'Package version mismatch detected!',
      `- Expected: ${expectedVersion}`,
      '- Received:',
    ].join('\n')
  );
  console.error(results.filter(({ isValid }) => !isValid));
  hasError = true;
} else {
  console.log('Package versions are in sync.');
}

console.log('');

const sharedVersion = fs.readFileSync(
  path.join(__dirname, '../../packages/autocomplete-shared/src/version.ts'),
  { encoding: 'utf-8' }
);

if (sharedVersion !== `export const version = '${expectedVersion}';\n`) {
  console.error(
    [
      'Shared version mismatch detected!',
      `- Expected: ${expectedVersion}`,
      `- Received: ${sharedVersion}`,
    ].join('\n')
  );
  hasError = true;
} else {
  console.log('Shared version file is in sync.');
}

if (hasError) {
  process.exit(1);
}
