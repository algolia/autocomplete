// Parcel picks the `source` field of the monorepo packages and thus doesn't
// apply the Babel config. We therefore need to manually override the constants
// in the app, as well as the React pragmas.
// See https://twitter.com/devongovett/status/1134231234605830144
(global as any).__DEV__ = process.env.NODE_ENV !== 'production';
(global as any).__TEST__ = false;
