/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

const packages = [
  'packages/autocomplete-core',
  'packages/autocomplete-preset-algolia',
  'packages/autocomplete-js',
];

module.exports = {
  monorepo: {
    mainVersionFile: 'lerna.json',
    packagesToBump: packages,
    packagesToPublish: packages,
  },
  publishCommand({ tag }) {
    return `yarn publish --access public --tag ${tag}`;
  },
  versionUpdated({ exec, dir, version }) {
    // Ship.js reads JSON and writes with `fs.writeFileSync(JSON.stringify(json, null, 2))`
    // which causes a lint error in the `lerna.json` file.
    exec('yarn eslint lerna.json --fix');

    updatePackageDependencies(
      exec,
      {
        package: '@algolia/autocomplete-js',
        dependencies: [
          `@algolia/autocomplete-core@^${version}`,
          `@algolia/autocomplete-preset-algolia@^${version}`,
        ],
      },
      {
        package: '@algolia/js-example',
        dependencies: [`@algolia/autocomplete-js@^${version}`],
      }
    );
    updatePackagesVersion({
      version,
      files: [
        path.resolve(dir, 'packages', 'autocomplete-core', 'src', 'version.ts'),
        path.resolve(
          dir,
          'packages',
          'autocomplete-preset-algolia',
          'src',
          'version.ts'
        ),
      ],
    });
  },
  // Skip preparation if it contains only `chore` commits
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;

    if (releaseType === 'patch' && fix === 0) {
      return false;
    }

    return true;
  },
};

function updatePackageDependencies(exec, ...changes) {
  for (const change of changes) {
    const { package, dependencies } = change;

    exec(
      `yarn workspace ${package} add ${dependencies
        .map((dep) => `"${dep}"`)
        .join(' ')}`
    );
  }
}

function updatePackagesVersion({ version, files }) {
  for (const file of files) {
    fs.writeFileSync(file, `export const version = '${version}';\n`);
  }
}
