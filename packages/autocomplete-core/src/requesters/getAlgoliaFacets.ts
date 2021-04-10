import { createRequester } from '../createRequester';
import { fetchAlgoliaResults } from '../fetchers';

export const getAlgoliaFacets = createRequester({
  fetcher: fetchAlgoliaResults,
  transformResponse: ({ facetHits }) => facetHits,
});
