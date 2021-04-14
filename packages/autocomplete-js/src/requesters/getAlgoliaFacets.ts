import { createAlgoliaRequester } from './createAlgoliaRequester';

export const getAlgoliaFacets = createAlgoliaRequester({
  transformResponse: (result) => result.facetHits,
});
