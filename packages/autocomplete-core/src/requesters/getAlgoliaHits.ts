import { createRequester } from '../createRequester';
import { fetchAlgoliaHits } from '../fetchers/fetchAlgoliaHits';

export const getAlgoliaHits = createRequester({
  fetcher: fetchAlgoliaHits,
});
