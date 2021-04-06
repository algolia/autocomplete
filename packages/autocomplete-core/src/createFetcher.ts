import { SearchClient } from 'algoliasearch/lite';

type QueryWithMetadata<TQuery> = {
  query: TQuery;
} & any;

type RequesterOptions<TQuery> = {
  searchClient: SearchClient;
  queries: TQuery[];
};

type FetcherOptions<TQuery> = {
  searchClient: SearchClient;
  queries: QueryWithMetadata<TQuery>[];
};

type Fetcher<TQuery, TResult> = (
  options: FetcherOptions<TQuery>
) => Promise<TResult[]>;

type CreateFetcherOptions<TQuery, TRawResult, TResults = TRawResult> = {
  request: (options: RequesterOptions<TQuery>) => Promise<TRawResult[]>;
  transform?: (
    results: TRawResult[],
    initialQueries: QueryWithMetadata<TQuery>[]
  ) => TResults[];
};

export function createFetcher<TQuery, TMetadata, TRawResult>({
  request,
  transform = (value) => value,
}: CreateFetcherOptions<TQuery, TMetadata, TRawResult>): Fetcher<
  TQuery,
  TRawResult
> {
  return function fetcher(options) {
    const queries = options.queries.map(({ query }) => query);

    return request({ ...options, queries }).then((results) =>
      transform(results, options.queries)
    );
  };
}
