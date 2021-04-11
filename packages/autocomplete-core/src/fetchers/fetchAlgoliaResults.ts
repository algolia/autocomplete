import { fetchAlgoliaResults as originalFetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import { MultipleQueriesQuery, SearchResponse } from '@algolia/client-search';

import { createFetcher } from '../createFetcher';
import { TransformedResponse } from '../createRequester';

export const fetchAlgoliaResults = createFetcher<
  MultipleQueriesQuery,
  SearchResponse<any>,
  TransformedResponse<any>
>({
  request: originalFetchAlgoliaResults,
  // @ts-ignore @TODO fix this type
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
