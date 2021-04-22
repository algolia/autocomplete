import {
  MultipleQueriesQuery,
  SearchForFacetValuesResponse,
  SearchResponse,
} from '@algolia/client-search';
import type { SearchClient } from 'algoliasearch/lite';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';
import { version } from '../version';

type UserAgent = { segment: string; version?: string };

export interface SearchParams {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
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
    const algoliaAgents: UserAgent[] = [
      { segment: 'autocomplete-core', version },
      ...userAgents,
    ];

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
