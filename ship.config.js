const fs = require('fs');
const path = require('path');

module.exports = {
  monorepo: {
    mainVersionFile: 'lerna.json',
    // We rely on Lerna to bump our dependencies.
    packagesToBump: [],
    packagesToPublish: [
      'packages/autocomplete-core',
      'packages/autocomplete-js',
      'packages/autocomplete-plugin-algolia-insights',
      'packages/autocomplete-plugin-query-suggestions',
      'packages/autocomplete-plugin-recent-searches',
      'packages/autocomplete-plugin-redirect-url',
      'packages/autocomplete-plugin-tags',
      'packages/autocomplete-preset-algolia',
      'packages/autocomplete-shared',
      'packages/autocomplete-theme-classic',
    ],
  },
  publishCommand({ tag }) {
    return `yarn publish --access public --tag ${tag}`;
  },
  pullRequestTeamReviewers: ['frontend-experiences-web'],
  versionUpdated({ exec, dir, version }) {
    // Update package dependencies
    exec(
      `yarn lerna version ${version} --exact --no-git-tag-version --no-push --yes`
    );

    // Ship.js reads JSON and writes with `fs.writeFileSync(JSON.stringify(json, null, 2))`
    // which causes a lint error in the `lerna.json` file.
    exec('yarn eslint lerna.json --fix');

    // Update version files
    updatePackagesVersionFile({
      version,
      files: [
        path.resolve(
          dir,
          'packages',
          'autocomplete-shared',
          'src',
          'version.ts'
        ),
      ],
    });
  },
  // Skip preparation if it contains only `chore` commits
  shouldPrepare({ releaseType, commitNumbersPerType }) {
    const { fix = 0 } = commitNumbersPerType;

    if (releaseType === 'patch' && fix === 0) {
      return false;
    }

    return true;
  },
  slack: {
    // disable slack notification for `prepared` lifecycle.
    // Ship.js will send slack message only for `releaseSuccess`.
    prepared: null,
  },
};

function updatePackagesVersionFile({ version, files }) {
  for (const file of files) {
    fs.writeFileSync(file, `export const version = '${version}';\n`);
  }
}
