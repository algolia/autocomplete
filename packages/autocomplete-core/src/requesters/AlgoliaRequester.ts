import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import type {
  FacetHit,
  Hit,
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';

export type AlgoliaFetchParams = Pick<
  Parameters<typeof fetchAlgoliaResults>[0],
  'searchClient' | 'queries'
>;

export type AlgoliaFetchResponse<
  THit
> = AlgoliaRequesterTransformedResponse<THit>;

export type AlgoliaRequesterParams<THit> = {
  transformResponse(
    response: AlgoliaRequesterResponse<THit>
  ): AlgoliaRequesterTransformedResponse<THit>;
};

export type AlgoliaRequesterQuery = MultipleQueriesQuery;

export type AlgoliaRequesterResponse<THit> = {
  results: Array<Array<SearchResponse<THit>>>;
  hits: Array<Array<Hit<THit>>>;
  facetHits: FacetHit[][];
};

export type AlgoliaRequesterTransformedResponse<THit> =
  | Array<SearchResponse<THit>>
  | Array<SearchResponse<THit>['hits']>
  | Array<SearchForFacetValuesResponse['facetHits']>;
