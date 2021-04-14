import { createFetcher } from './createFetcher';

export type TransformResponse<TResponse, TTransformedResponse> = (
  response: TResponse
) => TTransformedResponse;

export type TransformedResponse<TItem, TResponse, TTransformedResponse> = {
  items: TItem[];
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<
    TResponse,
    TTransformedResponse
  >;
};

export type Description<TFetcher, TResponse, TTransformedResponse> = {
  fetcher: TFetcher;
  transformResponse: TransformResponse<TResponse, TTransformedResponse>;
};

export type RequesterParams<TResponse, TTransformedResponse> = {
  transformResponse: TransformResponse<TResponse, TTransformedResponse>;
};

type Requester<TFetcher, TFetchParams, TResponse, TTransformedResponse> = (
  params: RequesterParams<TResponse, TTransformedResponse>
) => (
  fetchParams: any
) => Promise<Description<TFetcher, TResponse, TTransformedResponse>>;

export function createRequester<
  TFetcher,
  TFetchParams,
  TResponse,
  TTransformedResponse
>(
  fetcher: TFetcher
): Requester<TFetcher, TFetchParams, TResponse, TTransformedResponse> {
  const requesterFetcher = createFetcher<any, any, any, any>(fetcher);

  return function requester(requesterParams) {
    return function fetch(fetchParams) {
      return Promise.resolve({
        fetcher: requesterFetcher,
        ...requesterParams,
        ...fetchParams,
      });
    };
  };
}
