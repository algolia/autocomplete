import { createAlgoliaRequester } from './createAlgoliaRequester';
import { createGetAlgoliaFacets } from './createGetAlgoliaFacets';

export const getAlgoliaFacets = createGetAlgoliaFacets(createAlgoliaRequester);
