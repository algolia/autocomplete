import { MultipleQueriesQuery } from '@algolia/client-search';

import { RequestParams } from './createRequester';
import { createAlgoliaRequester } from './createAlgoliaRequester';

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
