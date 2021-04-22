import { createAlgoliaRequester } from './createAlgoliaRequester';

export const getAlgoliaResults = createAlgoliaRequester({
  transformResponse: (result) => result.hits,
});
