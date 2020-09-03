import { getAlgoliaHits as originalGetAlgoliaHits } from '@algolia/autocomplete-preset-algolia';

type SearchClient = any;
type SearchParameters = any;

interface GetAlgoliaSourceParams {
  searchClient: SearchClient;
  queries: SearchParameters[];
}

export function getAlgoliaHits(params: GetAlgoliaSourceParams) {
  if (typeof params.searchClient.addAlgoliaAgent === 'function') {
    params.searchClient.addAlgoliaAgent('autocomplete-react', __VERSION__);
  }

  return originalGetAlgoliaHits(params);
}
