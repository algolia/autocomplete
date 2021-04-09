import { createRequester } from '../createRequester';
import { fetchAlgoliaResults } from '../fetchers';

export const getAlgoliaResults = createRequester({
  fetcher: fetchAlgoliaResults,
});
