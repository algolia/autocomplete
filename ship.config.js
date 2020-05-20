/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

const packages = [
  'packages/autocomplete-core',
  'packages/autocomplete-preset-algolia',
  'packages/docsearch-react',
];

module.exports = {
  monorepo: {
    mainVersionFile: 'lerna.json',
    packagesToBump: packages,
    packagesToPublish: packages,
  },
  mergeStrategy: {
    toSameBranch: ['next'],
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
    exec('eslint lerna.json --fix');

    updatePackageDependencies(
      {
        package: '@docsearch/react',
        dependencies: [
          `@francoischalifour/autocomplete-core@^${version}`,
          `@francoischalifour/autocomplete-preset-algolia@^${version}`,
        ],
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
