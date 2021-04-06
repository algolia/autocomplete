import { SearchClient } from 'algoliasearch/lite';

type Query<TQuery, TMetadata extends {}> = { query: TQuery } & TMetadata;

type FetcherOptions<TQuery, TMetadata> = {
  searchClient: SearchClient;
  queries: Query<TQuery, TMetadata>[];
};

type Fetcher<TQuery, TMetadata, TResult> = (
  options: FetcherOptions<TQuery, TMetadata>
) => Promise<TResult[]>;

type CreateFetcherOptions<
  TQuery,
  TMetadata,
  TRawResult,
  TResults = TRawResult
> = {
  request: (
    options: FetcherOptions<TQuery, TMetadata>
  ) => Promise<TRawResult[]>;
  transform?: (
    results: TRawResult[],
    initialQueries: Query<TQuery, TMetadata>[]
  ) => TResults[];
};

export function createFetcher<TQuery, TMetadata, TRawResult>({
  request,
  transform = (value) => value,
}: CreateFetcherOptions<TQuery, TMetadata, TRawResult>): Fetcher<
  TQuery,
  TMetadata,
  TRawResult
> {
  return function fetcher(options) {
    return request(options).then((results) =>
      transform(results, options.queries)
    );
  };
}
