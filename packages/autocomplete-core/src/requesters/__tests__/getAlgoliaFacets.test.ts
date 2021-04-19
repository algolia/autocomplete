import { createSearchClient } from '../../../../../test/utils';
import { getAlgoliaFacets } from '../getAlgoliaFacets';

describe('getAlgoliaFacets', () => {
  test('returns the description', async () => {
    const searchClient = createSearchClient({
      search: jest.fn(),
    });
    const description = await getAlgoliaFacets({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          params: {
            facetName: 'categories',
            facetQuery: 'query',
          },
        },
      ],
    });

    expect(description).toEqual({
      fetcher: expect.any(Function),
      transformResponse: expect.any(Function),
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          params: {
            facetName: 'categories',
            facetQuery: 'query',
          },
        },
      ],
    });
  });
});
