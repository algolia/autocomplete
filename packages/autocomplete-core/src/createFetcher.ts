import { SearchClient } from 'algoliasearch/lite';

type QueryWithMetadata<TQuery> = {
  query: TQuery;
} & any;

export type OriginalRequesterOptions<TQuery> = {
  searchClient: SearchClient;
  queries: TQuery[];
};

type FetcherOptions<TQuery> = {
  searchClient: SearchClient;
  queries: Array<QueryWithMetadata<TQuery>>;
};

export type Fetcher<TQuery, TResult> = (
  options: FetcherOptions<TQuery>
) => Promise<TResult[]>;

type CreateFetcherOptions<TQuery, TRawResult, TResults = TRawResult> = {
  request: (options: OriginalRequesterOptions<TQuery>) => Promise<TRawResult[]>;
  mapToItems?: (
    results: TRawResult[],
    initialQueries: Array<QueryWithMetadata<TQuery>>
  ) => TResults[];
};

export function createFetcher<TQuery, TMetadata, TRawResult>({
  request,
  mapToItems = (value) => value,
}: CreateFetcherOptions<TQuery, TMetadata, TRawResult>): Fetcher<
  TQuery,
  TRawResult
> {
  return function fetcher(options) {
    const queries = options.queries.map(({ query }) => query);

    return request({ ...options, queries }).then((results) =>
      mapToItems(results, options.queries)
    );
  };
}
