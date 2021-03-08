import * as preact from 'preact';

// Parcel picks the `source` field of the monorepo packages and thus doesn't
// apply the Babel config to replace our `__DEV__` global expression.
// We therefore need to manually override it in the example app.
// See https://twitter.com/devongovett/status/1134231234605830144
(global as any).__DEV__ = process.env.NODE_ENV !== 'production';
(global as any).__TEST__ = false;
(global as any).h = preact.h;
(global as any).React = preact;
