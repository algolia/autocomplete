import {
  Hit,
  MultipleQueriesQuery,
  MultipleQueriesResponse,
} from '@algolia/client-search';
import { SearchClient } from 'algoliasearch/lite';

import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from './constants';
import { version } from './version';

interface GetAlgoliaSourceParams {
  searchClient: SearchClient;
  queries: MultipleQueriesQuery[];
}

function getAlgoliaSource<THit>({
  searchClient,
  queries,
}: GetAlgoliaSourceParams) {
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

export function getAlgoliaResults<THit>({
  searchClient,
  queries,
}: GetAlgoliaSourceParams): Promise<MultipleQueriesResponse<THit>['results']> {
  return getAlgoliaSource<THit>({ searchClient, queries }).then((response) => {
    return response.results;
  });
}

export function getAlgoliaHits<THit>({
  searchClient,
  queries,
}: GetAlgoliaSourceParams): Promise<Array<Array<Hit<THit>>>> {
  return getAlgoliaSource<THit>({ searchClient, queries }).then((response) => {
    const results = response.results;

    return results.map((result) => result.hits);
  });
}
