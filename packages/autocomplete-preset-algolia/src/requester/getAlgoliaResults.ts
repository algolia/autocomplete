import { invariant } from '@algolia/autocomplete-shared';

import { createAlgoliaRequester } from './createAlgoliaRequester';
import { RequestParams } from './createRequester';

/**
 * Retrieves Algolia results from multiple indices.
 */
export function getAlgoliaResults<TTHit>(requestParams: RequestParams<TTHit>) {
  invariant(
    typeof requestParams.searchClient === 'object',
    'The `searchClient` option is required for getAlgoliaResults({ searchClient }).'
  );

  const requester = createAlgoliaRequester({
    transformResponse: (response) => response.hits,
  });

  return requester(requestParams);
}
