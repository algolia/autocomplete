import { version } from '@algolia/autocomplete-core';

import { flatten } from './utils';

type SearchClient = any;
export type Client = any;
type SearchResponse = any;
type QueryParameters = any;

interface SearchParameters {
  indexName: string;
  query: string;
  params?: QueryParameters;
}

interface GetAlgoliaSourceParams {
  searchClient: SearchClient;
  queries: SearchParameters[];
}

function getAlgoliaSource({ searchClient, queries }: GetAlgoliaSourceParams) {
  if (typeof (searchClient as Client).addAlgoliaAgent === 'function') {
    (searchClient as Client).addAlgoliaAgent('autocomplete-core', version);
  }

  return searchClient.search(
    queries.map((searchParameters) => {
      const { indexName, query, params } = searchParameters;

      return {
        indexName,
        query,
        params: {
          hitsPerPage: 5,
          highlightPreTag: '<mark>',
          highlightPostTag: '</mark>',
          ...params,
        },
      };
    })
  );
}

export function getAlgoliaResults({
  searchClient,
  queries,
}: GetAlgoliaSourceParams): Promise<SearchResponse['results']> {
  return getAlgoliaSource({ searchClient, queries }).then((response) => {
    return response.results;
  });
}

export function getAlgoliaHits({
  searchClient,
  queries,
}: GetAlgoliaSourceParams): Promise<SearchResponse['hits']> {
  return getAlgoliaSource({ searchClient, queries }).then((response) => {
    const results = response.results;

    // @TODO: should `getAlgoliaHits` flatten the hits?
    return flatten(results.map((result) => result.hits));
  });
}
