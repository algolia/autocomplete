// @TODO: simplify import
import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia/src/search/fetchAlgoliaResults';
import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

export type FetcherParams = Pick<
  Parameters<typeof fetchAlgoliaResults>[0],
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

type TransformResponse<THit> = (
  response: TransformResponseParams<THit>
) => TransformedRequesterResponse<THit>;

type FetcherParamsQuery<THit> = {
  query: MultipleQueriesQuery;
  __autocomplete_sourceId: string;
  __autocomplete_transformResponse: TransformResponse<THit>;
};

type InternalFetcherParams<THit> = {
  searchClient: SearchClient;
  queries: Array<FetcherParamsQuery<THit>>;
};

export type RequestParams<THit> = FetcherParams & {
  transformResponse: TransformResponse<THit>;
};

export type RequesterDescription<THit> = {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
  transformResponse: TransformResponse<THit>;
  fetcher: (
    fetcherParams: InternalFetcherParams<THit>
  ) => Promise<
    Array<{
      items: SearchResponse<THit>;
      __autocomplete_sourceId: string;
      __autocomplete_transformResponse: TransformResponse<THit>;
    }>
  >;
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
        fetcher: (fetcherParams: InternalFetcherParams<THit>) => {
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
