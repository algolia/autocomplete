import { getAlgoliaResults } from '@algolia/autocomplete-preset-algolia/src/search/getAlgoliaResults';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaResults = createFetcher({
  request: getAlgoliaResults,
  transform: (collections, initialQueries) => {
    return collections.map((results, index) => {
      const { __autocomplete_sourceId } = initialQueries[index];

      return {
        items: { results },
        __autocomplete_sourceId,
      };
    });
  },
});
