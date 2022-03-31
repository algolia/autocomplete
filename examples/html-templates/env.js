// Parcel picks the `source` field of the monorepo packages and thus doesn't
// apply the Babel config. We therefore need to manually override the constants
// in the app.
// See https://twitter.com/devongovett/status/1134231234605830144
global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__TEST__ = false;
