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
          {
            index: 'indexName',
            hits: [{ objectID: '1', label: 'Hit 1' }],
            queryID: 'queryID1',
          },
          {
            index: 'indexName2',
            hits: [{ objectID: '2', label: 'Hit 2' }],
            queryID: 'queryID2',
          }
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
        {
          indexName: 'indexName2',
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
      {
        indexName: 'indexName2',
        query: 'query',
        params: {
          hitsPerPage: 5,
          highlightPreTag: '__aa-highlight__',
          highlightPostTag: '__/aa-highlight__',
        },
      },
    ]);
    expect(results).toEqual([
      expect.objectContaining({
        hits: [
          {
            objectID: '1',
            label: 'Hit 1',
            __autocomplete_indexName: 'indexName',
            __autocomplete_queryID: 'queryID1',
            __autocomplete_algoliaCredentials: {
              appId: 'algoliaAppId',
              apiKey: 'algoliaApiKey',
            },
          },
        ],
      }),
      expect.objectContaining({
        hits: [
          {
            objectID: '2',
            label: 'Hit 2',
            __autocomplete_indexName: 'indexName2',
            __autocomplete_queryID: 'queryID2',
            __autocomplete_algoliaCredentials: {
              appId: 'algoliaAppId',
              apiKey: 'algoliaApiKey',
            },
          },
        ],
      }),
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
        {
          indexName: 'indexName2',
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
      {
        indexName: 'indexName2',
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
      expect.objectContaining({
        hits: [
          {
            objectID: '1',
            label: 'Hit 1',
            __autocomplete_indexName: 'indexName',
            __autocomplete_queryID: 'queryID1',
            __autocomplete_algoliaCredentials: {
              appId: 'algoliaAppId',
              apiKey: 'algoliaApiKey',
            },
          },
        ],
      }),
      expect.objectContaining({
        hits: [
          {
            objectID: '2',
            label: 'Hit 2',
            __autocomplete_indexName: 'indexName2',
            __autocomplete_queryID: 'queryID2',
            __autocomplete_algoliaCredentials: {
              appId: 'algoliaAppId',
              apiKey: 'algoliaApiKey',
            },
          },
        ],
      }),
    ]);
  });

  test('retrieves index name from query when not returned by response', async () => {
    const searchClient = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>({
            hits: [{ objectID: '1', label: 'Hit 1' }],
            queryID: 'queryID1',
          })
        )
      ),
    });

    const results = await fetchAlgoliaResults({
      searchClient,
      queries: [
        {
          indexName: 'indexName',
          query: 'query',
        },
      ],
    });

    expect(results).toEqual([
      expect.objectContaining({
        hits: [
          {
            objectID: '1',
            label: 'Hit 1',
            __autocomplete_indexName: 'indexName',
            __autocomplete_queryID: 'queryID1',
            __autocomplete_algoliaCredentials: {
              appId: 'algoliaAppId',
              apiKey: 'algoliaApiKey',
            },
          },
        ],
      }),
    ]);
  });

  test('attaches default Algolia agent', async () => {
    const searchClient = createTestSearchClient();

    await fetchAlgoliaResults({
      searchClient,
      queries: [{ indexName: 'indexName' }, { indexName: 'indexName2' }],
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
      queries: [{ indexName: 'indexName1' }, { indexName: 'indexName2' }],
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

  describe('missing credentials', () => {
    test('throws dev error when searchClient has no readable appId', () => {
      const searchClient = {
        search: createSearchClient().search,
      };

      expect(() => {
        fetchAlgoliaResults({
          // @ts-expect-error
          searchClient,
          queries: [],
          userAgents: [{ segment: 'custom-ua', version: '1.0.0' }],
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"[Autocomplete] The Algolia \`appId\` was not accessible from the searchClient passed."`
      );
    });

    test('throws dev error when searchClient has no readable apiKey', () => {
      const searchClient = {
        search: createSearchClient().search,
        transporter: {
          headers: {
            'x-algolia-application-id': 'appId',
          },
        },
      };

      expect(() => {
        fetchAlgoliaResults({
          // @ts-expect-error
          searchClient,
          queries: [],
          userAgents: [{ segment: 'custom-ua', version: '1.0.0' }],
        });
      }).toThrowErrorMatchingInlineSnapshot(
        `"[Autocomplete] The Algolia \`apiKey\` was not accessible from the searchClient passed."`
      );
    });

    test('does not throw dev error when searchClient is copied', () => {
      const searchClient = {
        ...createSearchClient(),
      };

      expect(() => {
        fetchAlgoliaResults({
          searchClient,
          queries: [],
          userAgents: [{ segment: 'custom-ua', version: '1.0.0' }],
        });
      }).not.toThrow();
    });
  });
});
