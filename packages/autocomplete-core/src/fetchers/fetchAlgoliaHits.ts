import { getAlgoliaHits } from '@algolia/autocomplete-preset-algolia/src/search/getAlgoliaHits';

import { createFetcher } from '../createFetcher';

export const fetchAlgoliaHits = createFetcher({
  request: getAlgoliaHits,
  transform: (collections, initialQueries) => {
    return collections.map((hits, index) => {
      const { __autocomplete_sourceId } = initialQueries[index];

      return hits.map((hit) => ({
        ...hit,
        __autocomplete_sourceId,
      }));
    });
  },
});
