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

interface GetAlgoliaSourceParams {
  searchClient: SearchClient;
  queries: SearchParameters[];
}

export function getAlgoliaSource({
  searchClient,
  queries,
}: GetAlgoliaSourceParams) {
  if (typeof (searchClient as Client).addAlgoliaAgent === 'function') {
    if (__DEV__) {
      (searchClient as Client).addAlgoliaAgent(
        `autocomplete.js (${__VERSION__}-development)`
      );
    } else {
      (searchClient as Client).addAlgoliaAgent(
        `autocomplete.js (${__VERSION__})`
      );
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
}: GetAlgoliaSourceParams): Promise<SearchResponse['results']> {
  return getAlgoliaSource({ searchClient, queries }).then(response => {
    return response.results;
  });
}

export function getAlgoliaHits({
  searchClient,
  queries,
}: GetAlgoliaSourceParams): Promise<SearchResponse['hits']> {
  return getAlgoliaSource({ searchClient, queries }).then(response => {
    const results = response.results;

    if (!results) {
      return [];
    }

    // @TODO: should `getAlgoliaHits` flatten the hits?
    return flatten(results.map(result => result.hits));
  });
}
