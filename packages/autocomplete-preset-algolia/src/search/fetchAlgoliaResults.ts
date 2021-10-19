import {
  userAgents as coreUserAgents,
  UserAgent,
} from '@algolia/autocomplete-shared';
import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';

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

export function fetchAlgoliaResults<TRecord>({
  searchClient,
  queries,
  userAgents = [],
}: SearchParams): Promise<
  Array<SearchResponse<TRecord> | SearchForFacetValuesResponse>
> {
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
      return response.results;
    });
}
