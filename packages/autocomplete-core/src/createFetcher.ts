import { TransformResponse } from './createRequester';

type FetcherParams<TQuery, TResponse, TItem> = {
  queries: Array<FetcherQuery<TQuery, TResponse, TItem>>;
};

export type Fetcher<TFetcherParams, TQuery, TResponse, TItem> = (
  params: FetcherParams<TQuery, TResponse, TItem> & TFetcherParams
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

type Request = (params: any) => Promise<any[]>;

export function createFetcher<
  TRequest extends Request,
  TQuery,
  TResponse,
  TItem
>(
  request: TRequest
): Fetcher<FetcherParams<TQuery, TResponse, TItem>, TQuery, TResponse, TItem> {
  return function fetcher(params) {
    const mappedQueries = params.queries.map((x) => x.query);

    return request({ ...params, queries: mappedQueries }).then((results) =>
      results.map((result, index) => {
        const {
          __autocomplete_sourceId,
          __autocomplete_transformResponse,
        } = params.queries[index];

        return {
          items: result,
          __autocomplete_sourceId,
          __autocomplete_transformResponse,
        };
      })
    );
  };
}
