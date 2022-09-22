# Contributing to Autocomplete

Welcome to the contributing guide for Autocomplete!

If this guide does not contain what you are looking for and thus prevents you from contributing, don't hesitate to [open an discussion](https://github.com/algolia/autocomplete/discussions).

## Reporting an issue

Opening an issue is very effective way to contribute because many users might also be impacted. We'll make sure to fix it quickly if it's technically feasible and doesn't have important side effects for other users.

Before reporting an issue, first check that there is not an already open issue for the same topic using the [issues page](https://github.com/algolia/autocomplete/issues). Don't hesitate to thumb up an issue that corresponds to the problem you have.

Another element that will help us go faster at solving the issue is to provide a reproducible test case. We recommend to [use this CodeSandbox template](https://codesandbox.io/s/github/algolia/autocomplete/tree/next/examples/playground?file=/app.tsx).

## Code contribution

For any code contribution, you need to:

- Make sure that the code change has been discussed in [Issues](https://github.com/algolia/autocomplete/issues) or [Discussions](https://github.com/algolia/autocomplete/discussions)
- Fork and clone the project
- Create a new branch for what you want to solve ("fix/<u>issue-number</u>", "feat/<u>name-of-the-feature</u>")
- Make your changes
- Open a pull request

Then:

- Automatic checks will be run
- A team member will review the pull request

When every check is green and a team member approves, your contribution is merged! 🚀

Before contributing, make sure you have the following dependencies set up on your machine:

- [Yarn v1](https://classic.yarnpkg.com/)
- [Node.js](https://nodejs.org/) (version available in [.nvmrc](https://github.com/algolia/autocomplete/blob/next/.nvmrc))
- setup for [node-gyp](https://github.com/nodejs/node-gyp) (on macOS, install the XCode Command Line Tools by running `xcode-select --install` in the terminal if you haven't already)
- a version of Chrome/Chromium (for Puppeteer)

## Commit conventions

This project follows the [conventional changelog](https://conventionalcommits.org/) approach. This means that all commit messages should be formatted using the following scheme:

```
type(scope): description
```

This convention is used to generate the [changelog](https://github.com/algolia/autocomplete/tree/next/CHANGELOG.md).

In most cases, we use the following types:

- `fix`: for any resolution of an issue (identified or not)
- `feat`: for any new feature
- `refactor`: for any code change that neither adds a feature nor fixes an issue
- `docs`: for any documentation change or addition
- `chore`: for anything that is not related to the library itself (e.g., doc, tooling)

Even though the scope is optional, we try to fill it in as it helps us better understand the impact of a change.

Finally, if your work is based on an issue on GitHub, please add in the body of the commit message "Closes #1234" if it solves the issue #1234 (read "[Closing issues using keywords](https://help.github.com/en/articles/closing-issues-using-keywords)").

Some examples of valid commit messages (used as first lines):

> - fix(js): increase magnifying glass size
> - feat(core): add `enterKeyHint` input prop
> - refactor(core): inline `navigator` default prop
> - docs(state): add `query` state property
> - docs(readme): add "Showcase" section
> - chore(deps): update dependency rollup-plugin-babel to v3.0.7

## Requirements

To run this project, you will need:

- Node.js ([nvm](https://github.com/creationix/nvm#install-script) is recommended)
- [Yarn](https://yarnpkg.com)

## Release

```sh
yarn run release
```

It will create a pull request for the next release. When it's reviewed, approved and merged, then CircleCI will automatically publish the packages to npm.
