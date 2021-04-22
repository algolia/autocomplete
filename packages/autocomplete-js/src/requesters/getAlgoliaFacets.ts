import { createGetAlgoliaFacets } from '@algolia/autocomplete-preset-algolia';

import { createAlgoliaRequester } from './createAlgoliaRequester';

export const getAlgoliaFacets = createGetAlgoliaFacets(createAlgoliaRequester);
