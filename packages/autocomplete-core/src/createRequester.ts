import { Fetcher, OriginalRequesterOptions } from './createFetcher';

export type WithTransformResponse<TType> = TType & {
  transformResponse?(response: any): any;
};

type Requester<TQuery, TResult> = (
  options: WithTransformResponse<OriginalRequesterOptions<TQuery>>
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
  return function requester(options) {
    return Promise.resolve({
      fetcher,
      ...options,
    });
  };
}
