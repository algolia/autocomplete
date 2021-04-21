import { createSearchClient } from '../../../../../test/utils';
import { getAlgoliaResults } from '../getAlgoliaResults';

describe('getAlgoliaResults', () => {
  test('returns the description', async () => {
    const searchClient = createSearchClient({
      search: jest.fn(),
    });
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
      execute: expect.any(Function),
      transformResponse: expect.any(Function),
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
