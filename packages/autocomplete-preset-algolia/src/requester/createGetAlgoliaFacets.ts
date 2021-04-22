import { MultipleQueriesQuery } from '@algolia/client-search';

import {
  RequesterDescription,
  RequestParams,
  RequesterParams,
} from './createRequester';

export function createGetAlgoliaFacets(
  requesterFn: (
    requesterParams: RequesterParams<any>
  ) => <TTHit>(
    requestParams: RequestParams<TTHit>
  ) => RequesterDescription<TTHit>
) {
  return function getAlgoliaFacets<TTHit>(requestParams: RequestParams<TTHit>) {
    const requester = requesterFn({
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
  };
}
