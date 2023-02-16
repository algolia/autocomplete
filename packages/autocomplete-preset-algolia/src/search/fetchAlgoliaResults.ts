import {
  userAgents as coreUserAgents,
  UserAgent,
} from '@algolia/autocomplete-shared';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';
import type {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
  SearchClient,
} from '../types';

export interface SearchParams {
  /**
   * The initialized Algolia search client.
   */
  searchClient: SearchClient;
  /**
   * A list of queries to execute.
   */
  queries: MultipleQueriesQuery[];
  /**
   * A list of user agents to add to the search client.
   *
   * This is useful to track usage of an integration.
   */
  userAgents?: UserAgent[];
}

function getSearchClientCredentials(searchClient: any): [string, string] {
  if (searchClient.transporter) {
    // searchClient v4
    const { headers, queryParameters } = searchClient.transporter;
    const APP_ID = 'x-algolia-application-id';
    const API_KEY = 'x-algolia-api-key';
    const appId = headers[APP_ID] || queryParameters[APP_ID];
    const apiKey = headers[API_KEY] || queryParameters[API_KEY];
    return [appId, apiKey];
  } else {
    // searchClient v3
    return [searchClient.applicationID, searchClient.apiKey];
  }
}

export function fetchAlgoliaResults<TRecord>({
  searchClient,
  queries,
  userAgents = [],
}: SearchParams): Promise<
  Array<SearchResponse<TRecord> | SearchForFacetValuesResponse>
> {
  const [appId, apiKey] = getSearchClientCredentials(searchClient);

  if (typeof searchClient.addAlgoliaAgent === 'function') {
    const algoliaAgents: UserAgent[] = [...coreUserAgents, ...userAgents];

    algoliaAgents.forEach(({ segment, version }) => {
      searchClient.addAlgoliaAgent(segment, version);
    });
  }

  return searchClient
    .search<TRecord>(
      queries.map((searchParameters) => {
        const { params, ...headers } = searchParameters;

        return {
          ...headers,
          params: {
            hitsPerPage: 5,
            highlightPreTag: HIGHLIGHT_PRE_TAG,
            highlightPostTag: HIGHLIGHT_POST_TAG,
            ...params,
          },
        };
      })
    )
    .then((response) => {
      // Go through each result and add insights metadata
      response.results.forEach((result) => {
        // @ts-ignore
        (result.hits || result.facetHits).forEach((hit) => {
          // @ts-ignore
          hit.__autocomplete_algoliaResultsMetadata = {
            appId,
            apiKey,
          };
        });
      });

      return response.results;
    });
}
