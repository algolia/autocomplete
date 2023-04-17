import { invariant } from '@algolia/autocomplete-shared';

import type { MultipleQueriesQuery } from '../types';

import { createAlgoliaRequester } from './createAlgoliaRequester';
import { RequestParams } from './createRequester';

/**
 * Retrieves Algolia facet hits from multiple indices.
 */
export function getAlgoliaFacets<TTHit>(requestParams: RequestParams<TTHit>) {
  invariant(
    typeof requestParams.searchClient === 'object',
    'The `searchClient` parameter is required for getAlgoliaFacets({ searchClient }).'
  );

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
