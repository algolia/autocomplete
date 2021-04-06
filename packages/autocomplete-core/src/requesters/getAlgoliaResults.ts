import { createRequester } from '../createRequester';
import { fetchAlgoliaResults } from '../fetchers/fetchAlgoliaResults';

export const getAlgoliaResults = createRequester({
  fetcher: fetchAlgoliaResults,
});
