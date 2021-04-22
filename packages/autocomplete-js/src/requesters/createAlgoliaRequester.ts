import {
  createRequester,
  fetchAlgoliaResults,
} from '@algolia/autocomplete-preset-algolia';

import { version } from '../version';

export const createAlgoliaRequester = createRequester((params) =>
  fetchAlgoliaResults({
    ...params,
    userAgents: [{ segment: 'autocomplete-js', version }],
  })
);
