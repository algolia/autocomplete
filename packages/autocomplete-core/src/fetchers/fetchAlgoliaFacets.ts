import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaFacets = createFetcher({
  request: fetchAlgoliaResults,
  mapToItems: (results, initialQueries) => {
    return results.map((result, index) => {
      const {
        __autocomplete_sourceId,
        __autocomplete_transformResponse = (x) => x.facetHits,
      } = initialQueries[index];

      return {
        items: result,
        __autocomplete_sourceId,
        __autocomplete_transformResponse,
      };
    });
  },
});
