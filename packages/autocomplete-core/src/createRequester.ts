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

export type Description<TFetcher> = {
  fetcher: TFetcher;
};

export type RequesterParams<TQuery> = {
  queries: TQuery[];
};

type Requester<TFetcher, TParams, TQuery> = (
  params: RequesterParams<TQuery> & TParams
) => Promise<Description<TFetcher>>;

type CreateRequesterParams<TFetcher, TResponse, TTransformedResponse> = {
  fetcher: TFetcher;
  transformResponse: TransformResponse<TResponse, TTransformedResponse>;
};

export function createRequester<
  TFetcher,
  TParams,
  TQuery,
  TResponse,
  TTransformedResponse
>({
  fetcher,
  transformResponse,
}: CreateRequesterParams<TFetcher, TResponse, TTransformedResponse>): Requester<
  TFetcher,
  TParams,
  TQuery
> {
  return function requester(params) {
    return Promise.resolve({
      fetcher,
      transformResponse,
      ...params,
    });
  };
}
