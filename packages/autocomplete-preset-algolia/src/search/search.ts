import { MultipleQueriesQuery } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';
import { version } from '../version';

import { UserAgent } from './UserAgent';

export interface SearchParams {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
  userAgents?: UserAgent[];
}

export function search<TRecord>({
  searchClient,
  queries,
  userAgents = [],
}: SearchParams) {
  if (typeof searchClient.addAlgoliaAgent === 'function') {
    const algoliaAgents: UserAgent[] = [
      { segment: 'autocomplete-core', version },
      ...userAgents,
    ];

    algoliaAgents.forEach(({ segment, version }) => {
      searchClient.addAlgoliaAgent(segment, version);
    });
  }

  return searchClient.search<TRecord>(
    queries.map((searchParameters) => {
      const { params, ...keys } = searchParameters;

      return {
        ...keys,
        params: {
          hitsPerPage: 5,
          highlightPreTag: HIGHLIGHT_PRE_TAG,
          highlightPostTag: HIGHLIGHT_POST_TAG,
          ...params,
        },
      };
    })
  );
}
