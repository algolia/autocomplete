import type { SearchClient } from 'algoliasearch/lite';

type QueryWithMetadata<TQuery> = {
  query: TQuery;
} & any;

export type OriginalRequesterOptions<TQuery> = {
  searchClient: SearchClient;
  queries: TQuery[];
};

export type FetcherOptions<TQuery> = {
  searchClient: SearchClient;
  queries: Array<QueryWithMetadata<TQuery>>;
};

export type Fetcher<TQuery, TResult> = (
  options: FetcherOptions<TQuery>
) => Promise<TResult[]>;

type FetcherResult<TResult> = {
  items: TResult[];
};

type CreateFetcherOptions<
  TQuery,
  TRawResult,
  TResult extends FetcherResult<any>
> = {
  request: (options: OriginalRequesterOptions<TQuery>) => Promise<TRawResult[]>;
  mapToItems: (
    results: TRawResult[],
    initialQueries: Array<QueryWithMetadata<TQuery>>
  ) => TResult[];
};

export function createFetcher<
  TQuery,
  TRawResult,
  TResult extends FetcherResult<any>
>({
  request,
  mapToItems,
}: CreateFetcherOptions<TQuery, TRawResult, TResult>): Fetcher<
  TQuery,
  TResult
> {
  return function fetcher(options) {
    const queries = options.queries.map(({ query }) => query);

    return request({ ...options, queries }).then((results) =>
      mapToItems(results, options.queries)
    );
  };
}
