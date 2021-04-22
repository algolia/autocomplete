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

  test('defaults transformItems to retrieve hits', async () => {
    const searchClient = createSearchClient({
      search: jest.fn(),
    });
    const description = await getAlgoliaResults<{ label: string }>({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    const transformedResponse = description.transformResponse({
      results: [],
      hits: [
        [
          {
            objectID: '1',
            label: 'Label',
            _highlightResult: {
              label: { value: 'Label', matchLevel: 'none', matchedWords: [] },
            },
          },
        ],
      ],
      facetHits: [],
    });

    expect(transformedResponse).toEqual([
      [
        {
          objectID: '1',
          label: 'Label',
          _highlightResult: {
            label: { value: 'Label', matchLevel: 'none', matchedWords: [] },
          },
        },
      ],
    ]);
  });
});
