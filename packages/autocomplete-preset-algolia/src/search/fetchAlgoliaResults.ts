import {
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';

import { search, SearchParams } from './search';

export function fetchAlgoliaResults<TRecord>({
  searchClient,
  queries,
  userAgents,
}: SearchParams): Promise<
  Array<SearchResponse<TRecord> | SearchForFacetValuesResponse>
> {
  return search<TRecord>({ searchClient, queries, userAgents }).then(
    (response) => {
      return response.results;
    }
  );
}
