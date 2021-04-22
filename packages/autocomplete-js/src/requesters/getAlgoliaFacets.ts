import { createAlgoliaRequester } from './createAlgoliaRequester';

/**
 * Retrieves Algolia facet hits from multiple indices.
 */
export const getAlgoliaFacets = createAlgoliaRequester({
  transformResponse: (response) => response.facetHits,
});
