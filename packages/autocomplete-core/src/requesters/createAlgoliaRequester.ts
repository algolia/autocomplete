import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

import { createRequester } from '../createRequester';

export const createAlgoliaRequester = createRequester(fetchAlgoliaResults);
