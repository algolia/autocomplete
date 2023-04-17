import { version } from '@algolia/autocomplete-shared';

import {
  createSFFVResponse,
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
    searchForFacetValues: jest.fn(() =>
      Promise.resolve([
        createSFFVResponse({
          facetHits: [
            {
              count: 507,
              value: 'Mobile phones',
              highlighted: 'Mobile <em>phone</em>s',
            },
            {
              count: 63,
              value: 'Phone cases',
              highlighted: '<em>Phone</em> cases',
            },
          ],
        }),
      ])
    ),
  });
}

describe('fetchAlgoliaResults', () => {
  test('with default options', async () => {
    const searchClient = createTestSearchClient();

    const results = await fetchAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 5,
          highlightPreTag: '__aa-highlight__',
          highlightPostTag: '__/aa-highlight__',
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({ hits: [{ objectID: '1', label: 'Hit 1' }] }),
      expect.objectContaining({ hits: [{ objectID: '2', label: 'Hit 2' }] }),
    ]);
  });

  test('with custom search parameters', async () => {
    const searchClient = createTestSearchClient();

    const results = await fetchAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      {
        indexName: 'indexName',
        query: 'query',
        params: {
          hitsPerPage: 10,
          highlightPreTag: '<em>',
          highlightPostTag: '</em>',
          page: 2,
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({ hits: [{ objectID: '1', label: 'Hit 1' }] }),
      expect.objectContaining({ hits: [{ objectID: '2', label: 'Hit 2' }] }),
    ]);
  });

  test('attaches default Algolia agent', async () => {
    const searchClient = createTestSearchClient();

    await fetchAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
          params: {
            hitsPerPage: 10,
            highlightPreTag: '<em>',
            highlightPostTag: '</em>',
            page: 2,
          },
        },
      ],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(1);
    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledWith(
      'autocomplete-core',
      version
    );
  });

  test('allows custom user agents', async () => {
    const searchClient = createTestSearchClient();

    await fetchAlgoliaResults({
      searchClient,
      queries: [],
      userAgents: [{ segment: 'custom-ua', version: '1.0.0' }],
    });

    expect(searchClient.addAlgoliaAgent).toHaveBeenCalledTimes(2);
    expect(searchClient.addAlgoliaAgent).toHaveBeenNthCalledWith(
      1,
      'autocomplete-core',
      version
    );
    expect(searchClient.addAlgoliaAgent).toHaveBeenNthCalledWith(
      2,
      'custom-ua',
      '1.0.0'
    );
  });
});
