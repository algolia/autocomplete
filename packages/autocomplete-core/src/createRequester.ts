import type {
  FacetHit,
  Hit,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';

import { Fetcher, OriginalRequesterOptions } from './createFetcher';

export type TransformResponse<TResponse> = (response: TResponse) => any[];

export type TransformedResponse<THit> = {
  items:
    | Array<SearchResponse<THit>>
    | Array<SearchResponse<THit>['hits']>
    | SearchForFacetValuesResponse[];
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<RequesterResponse<THit>>;
};

export type WithTransformResponse<TType> = TType & {
  transformResponse?: TransformResponse<RequesterResponse<{}>>;
};

type Requester<TQuery, TResult> = (
  options: WithTransformResponse<OriginalRequesterOptions<TQuery>>
) => Promise<Description<TQuery, TResult>>;

type RequesterResponse<THit> = {
  results: Array<Array<SearchResponse<THit>>>;
  hits: Array<Array<Hit<THit>>>;
  facetHits: FacetHit[][];
};

export type Description<TQuery, TResult> = {
  fetcher: Fetcher<TQuery, TResult>;
} & OriginalRequesterOptions<TQuery>;

type CreateRequesterOptions<TQuery, TResult> = {
  fetcher: Fetcher<TQuery, TResult>;
  transformResponse: TransformResponse<RequesterResponse<TResult>>;
};

export function createRequester<TQuery, TResult>({
  fetcher,
  transformResponse,
}: CreateRequesterOptions<TQuery, TResult>): Requester<TQuery, TResult> {
  return function requester(options) {
    return Promise.resolve({
      fetcher,
      transformResponse,
      ...options,
    });
  };
}
