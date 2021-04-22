import { MultipleQueriesQuery } from '@algolia/client-search';

import { createAlgoliaRequester } from './createAlgoliaRequester';
import { RequestParams } from './createRequester';

export function getAlgoliaFacets<TTHit>(requestParams: RequestParams<TTHit>) {
  const requester = createAlgoliaRequester({
    transformResponse: (result) => result.facetHits,
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
