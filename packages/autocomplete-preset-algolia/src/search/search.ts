import { MultipleQueriesQuery } from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';
import { version } from '../version';

export interface SearchParams {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
}

export function search<THit>({ searchClient, queries }: SearchParams) {
  if (typeof searchClient.addAlgoliaAgent === 'function') {
    searchClient.addAlgoliaAgent('autocomplete-core', version);
  }

  return searchClient.search<THit>(
    queries.map((searchParameters) => {
      const { indexName, query, params } = searchParameters;

      return {
        indexName,
        query,
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
