import { Hit } from '@algolia/client-search';

import { search, SearchParams } from './search';

export function getAlgoliaInsightsHits<TRecord>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<Array<Hit<TRecord>>>> {
  const insightsQueries = queries.map((query) => ({
    ...query,
    params: {
      ...query.params,
      clickAnalytics: true,
    },
  }));

  return search<TRecord>({ searchClient, queries: insightsQueries }).then(
    (response) => {
      const results = response.results;

      return results.map((result) =>
        result.hits.map((hit) => {
          return {
            ...hit,
            __autocomplete_indexName: result.index,
            __autocomplete_queryID: result.queryID!,
          };
        })
      );
    }
  );
}
