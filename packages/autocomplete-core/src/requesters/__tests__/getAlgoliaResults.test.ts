import { getAlgoliaResults } from '../getAlgoliaResults';
import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../../test/utils';
import { fetchAlgoliaResults } from '../../fetchers/fetchAlgoliaResults';

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

describe('getAlgoliaResults', () => {
  test('returns the description', async () => {
    const searchClient = createTestSearchClient();
    const description = await getAlgoliaResults({
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
      fetcher: fetchAlgoliaResults,
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
