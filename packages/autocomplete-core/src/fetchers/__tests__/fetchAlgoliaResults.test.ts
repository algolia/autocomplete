import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../../test/utils';
import { fetchAlgoliaResults } from '../fetchAlgoliaResults';

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

describe('fetchAlgoliaResults', () => {
  test.skip('fetches and transforms the results', async () => {
    const searchClient = createTestSearchClient();
    const results = await fetchAlgoliaResults({
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
        items: {
          results: expect.objectContaining({
            hits: [{ objectID: '1', label: 'Hit 1' }],
          }),
        },
        __autocomplete_sourceId: 'products',
      },
      {
        items: {
          results: expect.objectContaining({
            hits: [{ objectID: '2', label: 'Hit 2' }],
          }),
        },
        __autocomplete_sourceId: 'suggestions',
      },
    ]);
  });
});
