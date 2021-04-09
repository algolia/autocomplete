import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia/src/search/getAlgoliaResults';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaResults = createFetcher({
  request: getAlgoliaResults,
  mapToItems: (results, initialQueries) => {
    return results.map((result, index) => {
      const { __autocomplete_sourceId } = initialQueries[index];

      return {
        items: result,
        __autocomplete_sourceId,
      };
    });
  },
});
