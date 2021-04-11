import { TransformResponse } from './createRequester';

type FetcherParams<TQuery, TResponse, TItem> = {
  queries: Array<FetcherQuery<TQuery, TResponse, TItem>>;
};

export type FetcherRequestParams<TQuery> = {
  queries: TQuery[];
};

export type Fetcher<TRequesterParams, TQuery, TResponse, TItem> = (
  params: FetcherParams<TQuery, TResponse, TItem> & TRequesterParams
) => Promise<Array<FetcherResult<TResponse, TItem>>>;

export type FetcherQuery<TQuery, TResponse, TItem> = {
  query: TQuery;
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<TResponse, TItem[][]>;
};

type FetcherResult<TResponse, TItem> = {
  items: TResponse;
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<TResponse, TItem[][]>;
};

type CreateFetcherParams<TRequesterParams, TQuery, TResponse, TItem> = {
  request: (
    params: FetcherRequestParams<TQuery> & TRequesterParams
  ) => Promise<TResponse[]>;
  mapToItems: (
    results: TResponse[],
    initialQueries: Array<FetcherQuery<TQuery, TResponse, TItem>>
  ) => Array<FetcherResult<TResponse, TItem>>;
};

export function createFetcher<TRequesterParams, TQuery, TResponse, TItem>({
  request,
  mapToItems,
}: CreateFetcherParams<TRequesterParams, TQuery, TResponse, TItem>): Fetcher<
  FetcherParams<TQuery, TResponse, TItem>,
  TQuery,
  TResponse,
  TItem
> {
  return function fetcher(params) {
    const mappedQueries = params.queries.map((x) => x.query);

    return request({ ...params, queries: mappedQueries }).then((results) =>
      mapToItems(results, params.queries)
    );
  };
}
