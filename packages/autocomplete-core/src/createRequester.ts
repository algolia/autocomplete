// @TODO: simplify import
import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia/src/search/fetchAlgoliaResults';
import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

type Fetcher = typeof fetchAlgoliaResults;

export type FetcherParams = Pick<
  Parameters<Fetcher>[0],
  'searchClient' | 'queries'
>;

type RequesterParams<THit> = {
  transformResponse(
    response: TransformResponseParams<THit>
  ): TransformedRequesterResponse<THit>;
};

type TransformResponseParams<THit> = {
  results: Array<SearchResponse<THit>>;
  hits: Array<SearchResponse<THit>['hits']>;
  facetHits: Array<SearchForFacetValuesResponse['facetHits']>;
};

type TransformedRequesterResponse<THit> =
  | Array<SearchResponse<THit>['hits']>
  | Array<SearchForFacetValuesResponse['facetHits']>;

export type TransformResponse<THit> = (
  response: TransformResponseParams<THit>
) => TransformedRequesterResponse<THit>;

type FetcherParamsQuery<THit> = {
  query: MultipleQueriesQuery;
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<THit>;
};

export type InternalFetcher<THit> = (params: {
  searchClient: SearchClient;
  queries: Array<FetcherParamsQuery<THit>>;
}) => Promise<InternalFetcherResponse<THit>>;

export type InternalFetcherResponse<THit> = Array<{
  items: SearchResponse<THit> | SearchForFacetValuesResponse; // @TODO: should it be an array?
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<THit>;
}>;

export type RequestParams<THit> = FetcherParams & {
  transformResponse: TransformResponse<THit>;
};

export type RequesterDescription<THit> = {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
  transformResponse: TransformResponse<THit>;
  fetcher: InternalFetcher<THit>;
};

export function createRequester(fetcher: typeof fetchAlgoliaResults) {
  return function createSpecifiedRequester(
    requesterParams: RequesterParams<any>
  ) {
    return function requester<THit>(
      requestParams: RequestParams<THit>
    ): Promise<RequesterDescription<THit>> {
      return Promise.resolve({
        // @TODO: rename `execute`
        fetcher: (fetcherParams) => {
          // @TODO: rename queries to requests?
          return fetcher<THit>({
            searchClient: fetcherParams.searchClient,
            queries: fetcherParams.queries.map((x) => x.query),
          }).then((responses) =>
            responses.map((response, index) => {
              const {
                __autocomplete_sourceId,
                __autocomplete_transformResponse,
              } = fetcherParams.queries[index];

              return {
                items: response,
                __autocomplete_sourceId,
                __autocomplete_transformResponse,
              };
            })
          );
        },
        ...requesterParams,
        ...requestParams,
      });
    };
  };
}
