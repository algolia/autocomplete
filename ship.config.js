/* eslint-disable import/no-commonjs */

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
  versionUpdated({ exec, version }) {
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

    updatePackageDependencies({
      package: '@algolia/autocomplete-js',
      dependencies: [
        `@algolia/autocomplete-core@^${version}`,
        `@algolia/autocomplete-preset-algolia@^${version}`,
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
