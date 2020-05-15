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
    const update = (...changes) => {
      for (const change of changes) {
        const { package, deps } = change;

        /*
        With caret(^), the dependencies need to be quoted, like the following:
        > yarn workspace abc add "def@^1.0.0" "ghi@^1.0.0"
      */
        const depsWithVersion = deps
          .map((dep) => `"${dep}@^${version}"`)
          .join(' ');
        exec(`yarn workspace ${package} add ${depsWithVersion}`);
      }
    };

    // Ship.js read json and write like fs.writeFileSync(JSON.stringify(json, null, 2));
    // It causes a lint error with lerna.json file.
    exec('eslint lerna.json --fix');

    update({
      package: '@docsearch/react',
      deps: [
        '@francoischalifour/autocomplete-core',
        '@francoischalifour/autocomplete-preset-algolia',
      ],
    });

    fs.writeFileSync(
      path.resolve(dir, 'packages', 'docsearch-react', 'src', 'version.ts'),
      `export const version = '${version}';\n`
    );
  },
  // skip preparation if it contains only `chore` commits
  shouldPrepare: ({ releaseType, commitNumbersPerType }) => {
    const { fix = 0 } = commitNumbersPerType;
    if (releaseType === 'patch' && fix === 0) {
      return false;
    }
    return true;
  },
};
