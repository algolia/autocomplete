/* eslint-disable import/no-commonjs */

const packages = [
  'packages/autocomplete-core',
  'packages/autocomplete-preset-algolia',
  // @TODO: toggle when we release the React package
  // 'packages/autocomplete-react',
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
  versionUpdated({ exec }) {
    // @TODO: toggle when we release the React package
    // const update = ({ package, deps }) => {
    //   /*
    //     With caret(^), the dependencies need to be quoted, like the following:
    //     > yarn workspace abc add "def@^1.0.0" "ghi@^1.0.0"
    //   */
    //   const depsWithVersion = deps.map(dep => `"${dep}@^${version}"`).join(' ');
    //   exec(`yarn workspace ${package} add ${depsWithVersion}`);
    // };

    // Ship.js read json and write like fs.writeFileSync(JSON.stringify(json, null, 2));
    // It causes a lint error with lerna.json file.
    exec('eslint lerna.json --fix');

    // @TODO: toggle when we release the React package
    // update({
    //   package: '@francoischalifour/autocomplete-react',
    //   deps: [
    //     '@francoischalifour/autocomplete-core',
    //     '@francoischalifour/autocomplete-preset-algolia',
    //   ],
    // });
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
