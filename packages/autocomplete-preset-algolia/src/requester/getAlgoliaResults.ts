import { invariant } from '@algolia/autocomplete-shared';

import { RequestParams } from '../types';

import { createAlgoliaRequester } from './createAlgoliaRequester';

/**
 * Retrieves Algolia results from multiple indices.
 */
export function getAlgoliaResults<TTHit>(requestParams: RequestParams<TTHit>) {
  invariant(
    typeof requestParams.searchClient === 'object',
    'The `searchClient` parameter is required for getAlgoliaResults({ searchClient }).'
  );

  const requester = createAlgoliaRequester({
    transformResponse: (response) => response.hits,
  });

  return requester(requestParams);
}
