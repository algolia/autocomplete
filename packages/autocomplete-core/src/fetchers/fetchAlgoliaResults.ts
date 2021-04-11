import { fetchAlgoliaResults as originalFetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import type {
  Hit,
  MultipleQueriesQuery,
  SearchResponse,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

import { createFetcher } from '../createFetcher';

type AlgoliaRequesterParams = {
  searchClient: SearchClient;
};

export const fetchAlgoliaResults = createFetcher<
  AlgoliaRequesterParams,
  MultipleQueriesQuery,
  SearchResponse<{}>,
  Hit<{}>
>({
  request: originalFetchAlgoliaResults,
  mapToItems: (results, initialQueries) => {
    return results.map((result, index) => {
      const {
        __autocomplete_sourceId,
        __autocomplete_transformResponse,
      } = initialQueries[index];

      return {
        items: result,
        __autocomplete_sourceId,
        __autocomplete_transformResponse,
      };
    });
  },
});
