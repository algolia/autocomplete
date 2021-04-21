import { fetchAlgoliaResults } from '@algolia/autocomplete-preset-algolia';
import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

type Fetcher = typeof fetchAlgoliaResults;

type FacetHit = {
  label: string;
  count: number;
  _highlightResult: {
    label: {
      value: string;
    };
  };
};

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
  results: Array<SearchResponse<THit> | SearchForFacetValuesResponse>;
  hits: Array<SearchResponse<THit>['hits']>;
  facetHits: FacetHit[][];
};

type TransformedRequesterResponse<THit> =
  | Array<SearchResponse<THit>['hits']>
  | FacetHit[][];

export type TransformResponse<THit> = (
  response: TransformResponseParams<THit>
) => TransformedRequesterResponse<THit>;

type FetcherParamsQuery<THit> = {
  query: MultipleQueriesQuery;
  sourceId: string;
  transformResponse: TransformResponse<THit>;
};

export type Execute<THit> = (params: {
  searchClient: SearchClient;
  queries: Array<FetcherParamsQuery<THit>>;
}) => Promise<ExecuteResponse<THit>>;

export type ExecuteResponse<THit> = Array<{
  items: SearchResponse<THit> | SearchForFacetValuesResponse;
  sourceId: string;
  transformResponse: TransformResponse<THit>;
}>;

export type RequestParams<THit> = FetcherParams & {
  transformResponse?: TransformResponse<THit>;
};

export type RequesterDescription<THit> = {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
  transformResponse: TransformResponse<THit>;
  execute: Execute<THit>;
};

export function createRequester(fetcher: Fetcher) {
  function execute(fetcherParams) {
    // @TODO: rename queries to requests?
    return fetcher<any>({
      searchClient: fetcherParams.searchClient,
      queries: fetcherParams.queries.map((x) => x.query),
    }).then((responses) =>
      responses.map((response, index) => {
        const { sourceId, transformResponse } = fetcherParams.queries[index];

        return {
          items: response,
          sourceId,
          transformResponse,
        };
      })
    );
  }

  return function createSpecifiedRequester(
    requesterParams: RequesterParams<any>
  ) {
    return function requester<THit>(
      requestParams: RequestParams<THit>
    ): RequesterDescription<THit> {
      return {
        execute,
        ...requesterParams,
        ...requestParams,
      };
    };
  };
}
