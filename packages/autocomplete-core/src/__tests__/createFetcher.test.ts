import { createFetcher } from '../createFetcher';
import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { getAlgoliaHits } from '../../../autocomplete-preset-algolia/src/search/getAlgoliaHits';

function createTestSearchClient() {
  return createSearchClient({
    search: () =>
      Promise.resolve(
        createMultiSearchResponse<{ label: string }>(
          { hits: [{ objectID: '1', label: 'Hit 1' }] },
          { hits: [{ objectID: '2', label: 'Hit 2' }] }
        )
      ),
  });
}

describe('createFetcher', () => {
  test('uses the passed `request` function to fetch data', async () => {
    const searchClient = createTestSearchClient();
    const fetchAlgoliaHits = createFetcher({
      request: getAlgoliaHits,
    });

    const results = await fetchAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
        {
          indexName: 'indexName2',
          query: 'query',
        },
      ],
    });

    expect(results).toEqual([
      [{ objectID: '1', label: 'Hit 1' }],
      [{ objectID: '2', label: 'Hit 2' }],
    ]);
  });
  test('uses the passed `transform` function to transform the retrieved results', async () => {
    const searchClient = createTestSearchClient();
    const fetchAlgoliaHits = createFetcher({
      request: getAlgoliaHits,
      transform: (collections, initialQueries) => {
        return collections.map((hits, index) => {
          const { indexName } = initialQueries[index];

          return hits.map((hit) => ({
            ...hit,
            indexName,
          }));
        });
      },
    });

    const results = await fetchAlgoliaHits({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
        {
          indexName: 'indexName2',
          query: 'query',
        },
      ],
    });

    expect(results).toEqual([
      [{ objectID: '1', label: 'Hit 1', indexName: 'indexName' }],
      [{ objectID: '2', label: 'Hit 2', indexName: 'indexName2' }],
    ]);
  });
});
