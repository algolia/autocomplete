/* eslint-disable import/no-commonjs */

const fs = require('fs');
const path = require('path');

module.exports = {
  mergeStrategy: {
    toSameBranch: ['next'],
  },
  publishCommand({ tag }) {
    return `yarn publish --access public --tag ${tag}`;
  },
  versionUpdated({ version, dir }) {
    // Bump the string version in the version file
    const versionPath = path.resolve(dir, 'src/version.ts');
    fs.writeFileSync(versionPath, `export const version = '${version}';\n`);
  },
  // @TODO: this will be possible once this is addressed:
  // https://github.com/algolia/shipjs/issues/604
  // afterPublish({ exec, dir }) {
  //   // Update the Autocomplete.js version in the examples
  //   const examplePath = path.resolve(dir, 'examples/autocomplete.js');
  //   const { version } = require('./package.json');

  //   // eslint-disable-next-line no-console
  //   console.log('Updating Autocomplete.js dependency in examples...');

  //   exec(
  //     `cd ${examplePath} && yarn upgrade @francoischalifour/autocomplete.js@${version}`
  //   );
  //   exec('git add examples');
  //   exec('git commit -m "chore(examples): update autocomplete.js dependency"');
  //   exec('git push origin next');
  // },
};
