import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia/src/search/fetchAlgoliaResults';

import { createRequester } from '../createRequester';

export const createAlgoliaRequester = createRequester(fetchAlgoliaResults);
