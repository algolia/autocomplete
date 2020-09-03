import { getAlgoliaResults as originalGetAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

type SearchClient = any;
type SearchParameters = any;

interface GetAlgoliaSourceParams {
  searchClient: SearchClient;
  queries: SearchParameters[];
}

export function getAlgoliaResults(params: GetAlgoliaSourceParams) {
  if (typeof params.searchClient.addAlgoliaAgent === 'function') {
    params.searchClient.addAlgoliaAgent('autocomplete-react', __VERSION__);
  }

  return originalGetAlgoliaResults(params);
}
