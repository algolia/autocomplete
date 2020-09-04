// Rollup failed to build because it couldn't find @algolia/autocomplete-js,
// although it is in the peerDependencies.
// This seems to be a workaround.
// https://github.com/ezolenko/rollup-plugin-typescript2/issues/198
declare module '@algolia/autocomplete-js';
