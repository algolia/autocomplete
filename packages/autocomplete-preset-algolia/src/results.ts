import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from './constants';
import { version } from './version';

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
          highlightPreTag: HIGHLIGHT_PRE_TAG,
          highlightPostTag: HIGHLIGHT_POST_TAG,
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

    return results.map((result) => result.hits);
  });
}
