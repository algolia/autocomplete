import type {
  FacetHit,
  Hit,
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

export type AlgoliaRequesterParams = {
  searchClient: SearchClient;
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
