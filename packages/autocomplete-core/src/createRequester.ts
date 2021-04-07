import { Fetcher, OriginalRequesterOptions } from './createFetcher';

type Requester<TQuery, TResult> = (
  options: OriginalRequesterOptions<TQuery>
) => Promise<Description<TQuery, TResult>>;

export type Description<TQuery, TResult> = {
  fetcher: Fetcher<TQuery, TResult>;
} & OriginalRequesterOptions<TQuery>;

type CreateRequesterOptions<TQuery, TResult> = {
  fetcher: Fetcher<TQuery, TResult>;
};

export function createRequester<TQuery, TResult>({
  fetcher,
}: CreateRequesterOptions<TQuery, TResult>): Requester<TQuery, TResult> {
  return function requester(options: OriginalRequesterOptions<TQuery>) {
    return Promise.resolve({
      fetcher,
      ...options,
    });
  };
}
