import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia/src/search/getAlgoliaHits';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaHits = createFetcher({
  request: getAlgoliaHits,
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
