import { createRequester } from '../createRequester';
import { createFetcher } from '../createFetcher';
import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { getAlgoliaHits as originalGetAlgoliaHits } from '../../../autocomplete-preset-algolia/src/search/getAlgoliaHits';

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

describe('createRequester', () => {
  test('returns a description', async () => {
    const searchClient = createTestSearchClient();
    const fetchAlgoliaHits = createFetcher({
      request: originalGetAlgoliaHits,
    });
    const getAlgoliaHits = createRequester({
      fetcher: fetchAlgoliaHits,
    });

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
