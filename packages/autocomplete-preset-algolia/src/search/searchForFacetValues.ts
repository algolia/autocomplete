import {
  SearchForFacetValuesQueryParams,
  SearchOptions,
} from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants';
import { version } from '../version';

import { UserAgent } from './UserAgent';

type FacetQuery = {
  indexName: string;
  params: SearchForFacetValuesQueryParams & SearchOptions;
};
export interface SearchForFacetValuesParams {
  searchClient: SearchClient;
  queries: FacetQuery[];
  userAgents?: UserAgent[];
}

export function searchForFacetValues({
  searchClient,
  queries,
  userAgents = [],
}: SearchForFacetValuesParams) {
  if (typeof searchClient.addAlgoliaAgent === 'function') {
    const algoliaAgents: UserAgent[] = [
      { segment: 'autocomplete-core', version },
      ...userAgents,
    ];

    algoliaAgents.forEach(({ segment, version }) => {
      searchClient.addAlgoliaAgent(segment, version);
    });
  }

  return searchClient.searchForFacetValues(
    queries.map((searchParameters) => {
      const { indexName, params } = searchParameters;

      return {
        indexName,
        params: {
          highlightPreTag: HIGHLIGHT_PRE_TAG,
          highlightPostTag: HIGHLIGHT_POST_TAG,
          ...params,
        },
      };
    })
  );
}
