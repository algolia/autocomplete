import { fetchAlgoliaResults as originalFetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaResults = createFetcher({
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
