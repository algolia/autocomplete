import { createAlgoliaRequester } from './createAlgoliaRequester';

/**
 * Retrieves Algolia results from multiple indices.
 */
export const getAlgoliaResults = createAlgoliaRequester({
  transformResponse: (response) => response.hits,
});
