import { MultipleQueriesResponse } from '@algolia/client-search';

import { search, SearchParams } from './search';

export function getAlgoliaResults<THit>({
  searchClient,
  queries,
}: SearchParams): Promise<MultipleQueriesResponse<THit>['results']> {
  return search<THit>({ searchClient, queries }).then((response) => {
    return response.results;
  });
}
