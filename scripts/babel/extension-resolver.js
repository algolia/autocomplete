// original source: https://github.com/shimataro/babel-plugin-module-extension-resolver
// To create proper ES Modules, the paths imported need to be fully-specified,
// and can't be resolved like is possible with CommonJS. To have large compatibility
// without much hassle, we don't use extensions *inside* the source code, but add
// them with this plugin.

const fs = require('fs');
const path = require('path');

const PLUGIN_NAME = 'babel-plugin-extension-resolver';

module.exports = function extensionResolver(
  { types },
  {
    modulesToResolve = [],
    srcExtensions = ['.js', '.ts', '.tsx'],
    dstExtension = '.js',
  }
) {
  return {
    name: PLUGIN_NAME,
    visitor: {
      Program: {
        enter: (programPath, state) => {
          const fileName = state.filename;
          programPath.traverse(
            {
              ImportDeclaration(declaration) {
                const source = declaration.get('source');
                replaceSource({
                  types,
                  source,
                  fileName,
                  modulesToResolve,
                  srcExtensions,
                  dstExtension,
                });
              },
              ExportDeclaration(declaration) {
                const source = declaration.get('source');
                if (Array.isArray(source)) {
                  return;
                }
                replaceSource({
                  types,
                  source,
                  fileName,
                  modulesToResolve,
                  srcExtensions,
                  dstExtension,
                });
              },
            },
            state
          );
        },
      },
    },
  };
};

function replaceSource({
  types,
  source,
  fileName,
  modulesToResolve,
  srcExtensions,
  dstExtension,
}) {
  if (!source.isStringLiteral()) {
    return;
  }
  const sourcePath = source.node.value;
  if (
    modulesToResolve.every((prefix) => !sourcePath.startsWith(`${prefix}/`)) &&
    !isRelativeDependency(sourcePath)
  ) {
    return;
  }
  const baseDir = path.dirname(fileName);

  let normalizedPath;
  if (isRelativeDependency(sourcePath)) {
    const resolvedPath = resolveRelativePath(
      baseDir,
      sourcePath,
      srcExtensions,
      dstExtension
    );
    normalizedPath = normalizeRelativePath(resolvedPath);
  } else {
    const resolvedPath = resolveAbsolutePath(sourcePath);
    normalizedPath = normalizeAbsolutePath(resolvedPath);
  }

  source.replaceWith(types.stringLiteral(normalizedPath));
}

function resolveRelativePath(baseDir, sourcePath, srcExtensions, dstExtension) {
  let resolvedPath = resolveRelativeExtension(
    baseDir,
    sourcePath,
    srcExtensions,
    dstExtension
  );

  if (resolvedPath === null) {
    resolvedPath = resolveRelativeExtension(
      baseDir,
      path.join(sourcePath, 'index'),
      srcExtensions,
      dstExtension
    );
  }

  if (resolvedPath === null) {
    throw new Error(`import for "${sourcePath}" could not be resolved`);
  }

  return resolvedPath;
}

/**
 * @param {string} sourcePath the path to resolve using require.resolve
 * @returns {string} the resolved path
 */
function resolveAbsolutePath(sourcePath) {
  // The source path is composed of: 1. the package name, 2. the path inside the package.
  const packageNameRegex = sourcePath.startsWith('@')
    ? /^(?<packageName>@[^/]+\/[^/]+)\/(?<pathName>.+)/
    : /^(?<packageName>[^/]+)\/(?<pathName>.+)/;
  const { packageName } = sourcePath.match(packageNameRegex).groups;

  // the require.resolve will return the full path of the requested file.
  const fullPath = require.resolve(sourcePath);

  // the bare package could resolve to a nested file, but /package.json is always at the root.
  // this gives us the path to the root of the package.
  const packageJson = '/package.json';
  const packagePath = require
    .resolve(packageName + packageJson)
    .slice(0, -packageJson.length);

  // We overlap the two parts to get path inside the package.
  const [, resolvedPath] = fullPath.split(packagePath);

  // That's then combined with the package name.
  return packageName + resolvedPath;
}

function resolveRelativeExtension(
  baseDir,
  sourcePath,
  srcExtensions,
  dstExtension
) {
  const absolutePath = path.join(baseDir, sourcePath);
  if (isFile(absolutePath)) {
    return sourcePath;
  }
  for (const extension of srcExtensions) {
    if (isFile(`${absolutePath}${extension}`)) {
      return path.relative(baseDir, `${absolutePath}${dstExtension}`);
    }
  }
  return null;
}

function normalizeRelativePath(originalPath) {
  let normalizedPath = originalPath;
  if (path.sep === '\\') {
    normalizedPath = normalizedPath.split(path.sep).join('/');
  }
  if (normalizedPath[0] !== '.') {
    normalizedPath = `./${normalizedPath}`;
  }
  return normalizedPath;
}

function normalizeAbsolutePath(originalPath) {
  let normalizedPath = originalPath;
  if (path.sep === '\\') {
    normalizedPath = normalizedPath.split(path.sep).join('/');
  }
  return normalizedPath;
}

function isFile(pathName) {
  try {
    return fs.statSync(pathName).isFile();
  } catch (err) {
    return false;
  }
}

function isRelativeDependency(sourcePath) {
  return sourcePath[0] === '.';
}
