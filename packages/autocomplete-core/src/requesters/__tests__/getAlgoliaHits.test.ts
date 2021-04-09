import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../../test/utils';
import { fetchAlgoliaHits } from '../../fetchers/fetchAlgoliaHits';
import { getAlgoliaHits } from '../getAlgoliaHits';

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

describe('getAlgoliaHits', () => {
  test('returns the description', async () => {
    const searchClient = createTestSearchClient();
    const description = await getAlgoliaHits({
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

    expect(description).toEqual({
      fetcher: fetchAlgoliaHits,
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
  });
});
