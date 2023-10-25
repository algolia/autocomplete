import {
  userAgents as coreUserAgents,
  UserAgent,
  invariant,
} from '@algolia/autocomplete-shared';
import type { SearchResponse } from '@algolia/autocomplete-shared';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';
import type { SearchForFacetValuesResponse, SearchParams } from '../types';
import { getAppIdAndApiKey } from '../utils';

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

  const { appId, apiKey } = getAppIdAndApiKey(searchClient);

  invariant(
    Boolean(appId),
    'The Algolia `appId` was not accessible from the searchClient passed.'
  );
  invariant(
    Boolean(apiKey),
    'The Algolia `apiKey` was not accessible from the searchClient passed.'
  );

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
      return response.results.map((result, resultIndex) => ({
        ...result,
        hits: result.hits?.map((hit) => ({
          ...hit,
          // Bring support for the Insights plugin.
          __autocomplete_indexName:
            result.index || queries[resultIndex].indexName,
          __autocomplete_queryID: result.queryID,
          __autocomplete_algoliaCredentials: {
            appId,
            apiKey,
          },
        })),
      }));
    });
}
