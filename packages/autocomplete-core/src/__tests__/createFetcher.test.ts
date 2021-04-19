import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { fetchAlgoliaResults } from '../../../autocomplete-preset-algolia';
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
  test('remaps queries and returns fetched data along with metadata', async () => {
    const searchClient = createTestSearchClient();
    const fetchFn = createFetcher(fetchAlgoliaResults);

    const results = await fetchFn({
      searchClient,
      queries: [
        {
          query: {
            indexName: 'indexName',
            query: 'query',
          },
          __autocomplete_sourceId: 'source1',
          __autocomplete_transformResponse: (response) => response,
        },
        {
          query: {
            indexName: 'indexName2',
            query: 'query',
          },
          __autocomplete_sourceId: 'source2',
          __autocomplete_transformResponse: (response) => response,
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
      expect.objectContaining({
        items: expect.objectContaining({
          hits: expect.arrayContaining([{ objectID: '1', label: 'Hit 1' }]),
        }),
        __autocomplete_sourceId: 'source1',
        __autocomplete_transformResponse: expect.any(Function),
      }),
      expect.objectContaining({
        items: expect.objectContaining({
          hits: expect.arrayContaining([{ objectID: '2', label: 'Hit 2' }]),
        }),
        __autocomplete_sourceId: 'source2',
        __autocomplete_transformResponse: expect.any(Function),
      }),
    ]);
  });
});
