import { SearchResponse } from '@algolia/client-search';

import { search, SearchParams } from './search';

export function getAlgoliaResults<TRecord>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<SearchResponse<TRecord>>> {
  return search<TRecord>({ searchClient, queries }).then((response) => {
    return response.results;
  });
}
