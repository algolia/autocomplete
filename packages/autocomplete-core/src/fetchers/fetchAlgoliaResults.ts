import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia/src/search/getAlgoliaResults';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaResults = createFetcher({
  request: getAlgoliaResults,
  transform: (collections, initialQueries) => {
    return collections.map((response, index) => {
      const { __autocomplete_sourceId } = initialQueries[index];

      return {
        ...response,
        __autocomplete_sourceId,
      };
    });
  },
});
