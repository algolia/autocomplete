const fs = require('fs');
const path = require('path');
const util = require('util');

const postcss = require('postcss');

const { plugins, ...postcssConfig } = require('../postcss.config');

const { getBundleBanner } = require('./getBundleBanner');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);

async function ensureDir(file) {
  const directory = path.dirname(file);

  if (!fs.existsSync(directory)) {
    await mkdir(directory);
  }
}

async function buildCss() {
  const [, , input, output] = process.argv;

  await ensureDir(output);

  const css = await readFile(input);
  const result = await postcss(plugins).process(css, {
    ...postcssConfig,
    from: input,
    to: output,
  });
  const banner = getBundleBanner(
    require(path.join(process.cwd(), 'package.json'))
  );

  await writeFile(output, [banner, result.css].join('\n'), () => true);
}

buildCss();
