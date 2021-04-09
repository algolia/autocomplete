import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../../test/utils';
import { fetchAlgoliaHits } from '../fetchAlgoliaHits';

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

describe('fetchAlgoliaHits', () => {
  test('fetches and transforms the results', async () => {
    const searchClient = createTestSearchClient();
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
        items: [{ objectID: '1', label: 'Hit 1' }],
        __autocomplete_sourceId: 'products',
      },
      {
        items: [{ objectID: '2', label: 'Hit 2' }],
        __autocomplete_sourceId: 'suggestions',
      },
    ]);
  });
});
