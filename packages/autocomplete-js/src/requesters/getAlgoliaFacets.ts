import { RequestParams } from '@algolia/autocomplete-preset-algolia';
import { MultipleQueriesQuery } from '@algolia/client-search';

import { createAlgoliaRequester } from './createAlgoliaRequester';

/**
 * Retrieves Algolia facet hits from multiple indices.
 */
export function getAlgoliaFacets<TTHit>(requestParams: RequestParams<TTHit>) {
  const requester = createAlgoliaRequester({
    transformResponse: (response) => response.facetHits,
  });

  const queries = requestParams.queries.map((query) => ({
    ...query,
    type: 'facet',
  })) as MultipleQueriesQuery[];

  return requester({
    ...requestParams,
    queries,
  });
}
