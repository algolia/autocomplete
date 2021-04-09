import { createRequester } from '../createRequester';
import { fetchAlgoliaFacets } from '../fetchers';

export const getAlgoliaFacets = createRequester({
  fetcher: fetchAlgoliaFacets,
});
