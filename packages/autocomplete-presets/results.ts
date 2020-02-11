import { version } from './package.json';
import { flatten } from './utils';

type SearchClient = any;
type Client = any;
type SearchResponse = any;
type QueryParameters = any;

interface SearchParameters {
  indexName: string;
  query: string;
  params?: QueryParameters;
}

interface GetAlgoliaSourceOptions {
  searchClient: SearchClient;
  queries: SearchParameters[];
}

export function getAlgoliaSource({
  searchClient,
  queries,
}: GetAlgoliaSourceOptions) {
  if (typeof (searchClient as Client).addAlgoliaAgent === 'function') {
    if (__DEV__) {
      (searchClient as Client).addAlgoliaAgent(
        `autocomplete.js (${version}-development)`
      );
    } else {
      (searchClient as Client).addAlgoliaAgent(`autocomplete.js (${version})`);
    }
  }

  return searchClient.search(
    queries.map(searchParameters => {
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
}: GetAlgoliaSourceOptions): Promise<SearchResponse['results']> {
  return getAlgoliaSource({ searchClient, queries }).then(response => {
    return response.results;
  });
}

export function getAlgoliaHits({
  searchClient,
  queries,
}: GetAlgoliaSourceOptions): Promise<SearchResponse['hits']> {
  return getAlgoliaSource({ searchClient, queries }).then(response => {
    const results = response.results;

    if (!results) {
      return [];
    }

    // @TODO: should `getAlgoliaHits` flatten the hits?
    return flatten(results.map(result => result.hits));
  });
}
