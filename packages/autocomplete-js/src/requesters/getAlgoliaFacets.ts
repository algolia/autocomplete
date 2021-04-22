import { createAlgoliaRequester } from './createAlgoliaRequester';

export const getAlgoliaFacets = createAlgoliaRequester({
  transformResponse: (response) => response.facetHits,
});
