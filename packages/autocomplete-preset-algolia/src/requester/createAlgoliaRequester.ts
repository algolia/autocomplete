import { fetchAlgoliaResults } from '../search';

import { createRequester } from './createRequester';

export const createAlgoliaRequester = createRequester(
  fetchAlgoliaResults,
  'algolia'
);
