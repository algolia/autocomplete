import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { getAlgoliaHits } from '../../../autocomplete-preset-algolia/src/search/getAlgoliaHits';
import { createFetcher } from '../createFetcher';

function createTestSearchClient() {
  return createSearchClient({
    search: jest.fn(() =>
      Promise.resolve(
        createMultiSearchResponse<{ label: string }>(
          { hits: [{ objectID: '1', label: 'Hit 1' }] },
          { hits: [{ objectID: '2', label: 'Hit 2' }] }
        )
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
          query: {
            indexName: 'indexName',
            query: 'query',
          },
        },
        {
          query: {
            indexName: 'indexName2',
            query: 'query',
          },
        },
      ],
    });

    expect(searchClient.search).toHaveBeenNthCalledWith(1, [
      expect.objectContaining({
        indexName: 'indexName',
        query: 'query',
      }),
      expect.objectContaining({
        indexName: 'indexName2',
        query: 'query',
      }),
    ]);
    expect(results).toEqual([
      [{ objectID: '1', label: 'Hit 1' }],
      [{ objectID: '2', label: 'Hit 2' }],
    ]);
  });
  test('uses the passed `transform` function to transform the retrieved results', async () => {
    const searchClient = createTestSearchClient();
    const fetchAlgoliaHits = createFetcher({
      request: getAlgoliaHits,
      mapToItems: (collections, initialQueries) => {
        return collections.map((hits, index) => {
          const { __autocomplete_sourceId } = initialQueries[index];

          return {
            hits,
            __autocomplete_sourceId,
          };
        });
      },
    });

    const results = await fetchAlgoliaHits({
      searchClient,
      queries: [
        {
          query: {
            indexName: 'indexName',
            query: 'query',
          },
          __autocomplete_sourceId: 'products',
        },
        {
          query: {
            indexName: 'indexName2',
            query: 'query',
          },
          __autocomplete_sourceId: 'suggestions',
        },
      ],
    });

    expect(searchClient.search).toHaveBeenNthCalledWith(1, [
      expect.objectContaining({
        indexName: 'indexName',
        query: 'query',
      }),
      expect.objectContaining({
        indexName: 'indexName2',
        query: 'query',
      }),
    ]);
    expect(results).toEqual([
      {
        hits: [{ objectID: '1', label: 'Hit 1' }],
        __autocomplete_sourceId: 'products',
      },
      {
        hits: [{ objectID: '2', label: 'Hit 2' }],
        __autocomplete_sourceId: 'suggestions',
      },
    ]);
  });
});
