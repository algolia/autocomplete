import { createRequester } from '@algolia/autocomplete-core';
import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

import { version } from '../version';

export const createAlgoliaRequester = createRequester((params) =>
  fetchAlgoliaResults({
    ...params,
    userAgents: [{ segment: 'autocomplete-js', version }],
  })
);
