import { createSearchClient } from '../../../../../test/utils';
import { getAlgoliaFacets } from '../getAlgoliaFacets';

describe('getAlgoliaFacets', () => {
  test('returns the description', () => {
    const searchClient = createSearchClient({
      search: jest.fn(),
    });
    const description = getAlgoliaFacets({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          facet: 'categories',
          params: {
            facetQuery: 'query',
            maxFacetHits: 10,
          },
        },
      ],
    });

    expect(description).toEqual({
      execute: expect.any(Function),
      requesterId: 'algolia',
      transformResponse: expect.any(Function),
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          type: 'facet',
          facet: 'categories',
          params: {
            facetQuery: 'query',
            maxFacetHits: 10,
          },
        },
      ],
    });
  });

  test('defaults transformItems to retrieve facetHits', () => {
    const searchClient = createSearchClient({
      search: jest.fn(),
    });
    const description = getAlgoliaFacets({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          facet: 'categories',
          params: {
            facetQuery: 'query',
            maxFacetHits: 10,
          },
        },
      ],
    });

    const transformedResponse = description.transformResponse({
      results: [],
      hits: [],
      facetHits: [
        [
          {
            count: 1,
            label: 'Label',
            _highlightResult: {
              label: {
                value: 'Label',
              },
            },
          },
        ],
      ],
    });

    expect(transformedResponse).toEqual([
      [
        {
          count: 1,
          label: 'Label',
          _highlightResult: {
            label: {
              value: 'Label',
            },
          },
        },
      ],
    ]);
  });
});
