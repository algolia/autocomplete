import {
  createRequester,
  fetchAlgoliaResults,
} from '@algolia/autocomplete-preset-algolia';

import { userAgents } from '../userAgents';

export const createAlgoliaRequester = createRequester(
  (params) =>
    fetchAlgoliaResults({
      ...params,
      userAgents,
    }),
  'algolia'
);
