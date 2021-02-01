import { Hit } from '@algolia/client-search';

import { search, SearchParams } from './search';

export function getAlgoliaHits<TRecord>({
  searchClient,
  queries,
  userAgents,
}: SearchParams): Promise<Array<Array<Hit<TRecord>>>> {
  return search<TRecord>({ searchClient, queries, userAgents }).then(
    (response) => {
      const results = response.results;

      return results.map((result) =>
        result.hits.map((hit) => {
          return {
            ...hit,
            __autocomplete_indexName: result.index,
            __autocomplete_queryID: result.queryID,
          };
        })
      );
    }
  );
}
