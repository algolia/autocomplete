/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

const packages = [
  'packages/autocomplete-core',
  'packages/autocomplete-preset-algolia',
  'packages/autocomplete-js',
  'packages/docsearch-css',
  'packages/docsearch-react',
  'packages/docsearch-js',
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
    const updatePackageDependencies = (...changes) => {
      for (const change of changes) {
        const { package, dependencies } = change;

        exec(
          `yarn workspace ${package} add ${dependencies
            .map((dep) => `"${dep}"`)
            .join(' ')}`
        );
      }
    };

    // Ship.js reads JSON and writes with `fs.writeFileSync(JSON.stringify(json, null, 2))`
    // which causes a lint error in the `lerna.json` file.
    exec('yarn eslint lerna.json --fix');

    updatePackageDependencies(
      {
        package: '@francoischalifour/autocomplete-js',
        dependencies: [
          `@francoischalifour/autocomplete-core@^${version}`,
          `@francoischalifour/autocomplete-preset-algolia@^${version}`,
        ],
      },
      {
        package: '@docsearch/react',
        dependencies: [
          `@docsearch/css@^${version}`,
          `@francoischalifour/autocomplete-core@^${version}`,
          `@francoischalifour/autocomplete-preset-algolia@^${version}`,
        ],
      },
      {
        package: '@docsearch/js',
        dependencies: [`@docsearch/react@^${version}`],
      },
      {
        package: '@francoischalifour/autocomplete-website',
        dependencies: [`@docsearch/react@${version}`],
      }
    );

    fs.writeFileSync(
      path.resolve(dir, 'packages', 'docsearch-react', 'src', 'version.ts'),
      `export const version = '${version}';\n`
    );
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
