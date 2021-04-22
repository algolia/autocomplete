import { createAlgoliaRequester } from './createAlgoliaRequester';

export const getAlgoliaResults = createAlgoliaRequester({
  transformResponse: (response) => response.hits,
});
