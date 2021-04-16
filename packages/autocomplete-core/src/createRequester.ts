import { MultipleQueriesQuery } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import {
  AlgoliaFetchParams,
  AlgoliaFetchResponse,
  AlgoliaRequesterParams,
  AlgoliaRequesterResponse,
  AlgoliaRequesterTransformedResponse,
} from './requesters';

type TransformResponse<TResponse, TRequesterResponse> = (
  response: TResponse
) => TRequesterResponse;

type Fetcher<TParams, TResponse> = (params: TParams) => Promise<TResponse>;

type FetcherParamsQuery<THit> = {
  query: MultipleQueriesQuery;
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<
    AlgoliaRequesterResponse<THit>,
    AlgoliaRequesterTransformedResponse<THit>
  >;
};

type FetcherParams<THit> = {
  searchClient: SearchClient;
  queries: Array<FetcherParamsQuery<THit>>;
};

export type RequestParams<THit> = AlgoliaFetchParams & {
  transformResponse: TransformResponse<
    AlgoliaRequesterResponse<THit>,
    AlgoliaRequesterTransformedResponse<THit>
  >;
};

export type RequesterDescription<THit> = {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
  transformResponse: TransformResponse<
    AlgoliaRequesterResponse<THit>,
    AlgoliaRequesterTransformedResponse<THit>
  >;
  fetcher: (
    fetcherParams: FetcherParams<THit>
  ) => Promise<
    Array<{
      items: AlgoliaRequesterTransformedResponse<THit>;
      __autocomplete_sourceId: string;
      __autocomplete_transformResponse: TransformResponse<
        AlgoliaRequesterResponse<THit>,
        AlgoliaRequesterTransformedResponse<THit>
      >;
    }>
  >;
};

export function createRequester(
  fetcher: Fetcher<AlgoliaFetchParams, AlgoliaFetchResponse<{}>>
) {
  return function createSpecifiedRequester(
    requesterParams: AlgoliaRequesterParams<{}>
  ) {
    return function requester<THit>(
      requestParams: RequestParams<THit>
    ): Promise<RequesterDescription<THit>> {
      return Promise.resolve({
        fetcher: (fetcherParams: FetcherParams<THit>) => {
          // console.log({
          //   requesterParams,
          //   requestParams,
          //   // queries -> requests
          //   fetcherParams,
          // });

          return fetcher({
            ...fetcherParams,
            queries: fetcherParams.queries.map((x) => x.query),
          }).then((results) =>
            results.map((result, index) => {
              const {
                __autocomplete_sourceId,
                __autocomplete_transformResponse,
              } = fetcherParams.queries[index];

              return {
                items: result,
                __autocomplete_sourceId,
                __autocomplete_transformResponse,
              };
            })
          );
        },
        ...requesterParams,
        ...requestParams,
      });
    };
  };
}
