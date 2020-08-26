import { execSync } from 'child_process';

export function getBundleBanner(pkg) {
  const lastCommitHash = execSync('git rev-parse --short HEAD')
    .toString()
    .trim();
  const version =
    process.env.NODE_ENV === 'production'
      ? process.env.VERSION
      : `${pkg.version} (UNRELEASED ${lastCommitHash})`;
  const authors = '© Algolia, Inc. and contributors';

  return `/*! ${pkg.name} ${version} | MIT License | ${authors} | ${pkg.homepage} */`;
}
