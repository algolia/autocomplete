import {
  createRequester,
  fetchAlgoliaResults,
} from '@algolia/autocomplete-preset-algolia';
import { fireEvent, waitFor, within } from '@testing-library/dom';

import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';
import { autocomplete } from '../autocomplete';
import { getAlgoliaResults, getAlgoliaFacets } from '../requesters';

describe('requester', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('batches calls when possible and re-dispatches results to the right sources', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const customFetch = jest.fn(() =>
      Promise.resolve([
        {
          label: 'Label 1',
        },
        {
          label: 'Label 2',
        },
      ])
    );
    const searchClient = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>(
            { hits: [{ objectID: '1', label: 'Hit 1' }] },
            { facetHits: [{ count: 2, value: 'Hit 2' }] },
            { hits: [{ objectID: '3', label: 'Hit 3' }] },
            { hits: [{ objectID: '4', label: 'Hit 4' }] },
            { hits: [{ objectID: '5', label: 'Hit 5' }] },
            { facetHits: [{ count: 6, value: 'Hit 6' }] }
          )
        )
      ),
    });
    const searchClient2 = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>({
            hits: [{ objectID: '7', label: 'Hit 7' }],
          })
        )
      ),
    });

    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'facets',
            getItems() {
              return getAlgoliaFacets({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                    },
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'custom',
            getItems() {
              return customFetch();
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'differentClient',
            getItems() {
              return getAlgoliaResults({
                searchClient: searchClient2,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'multi',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                  {
                    indexName: 'indexName2',
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'multiTypes',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                  {
                    indexName: 'indexName',
                    type: 'facet',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                    },
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'static',
            getItems() {
              return [
                {
                  label: 'Static label 1',
                },
                {
                  label: 'Static label 2',
                },
              ];
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(customFetch).toHaveBeenCalledTimes(1);

      expect(searchClient.search).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
          indexName: 'indexName',
          query: 'a',
        }),
        expect.objectContaining({
          indexName: 'indexName',
          type: 'facet',
          facet: 'categories',
          params: expect.objectContaining({
            facetQuery: 'a',
          }),
        }),
        expect.objectContaining({
          indexName: 'indexName',
          query: 'a',
        }),
        expect.objectContaining({
          indexName: 'indexName2',
          query: 'a',
        }),
        expect.objectContaining({
          indexName: 'indexName',
          query: 'a',
        }),
        expect.objectContaining({
          indexName: 'indexName',
          type: 'facet',
          facet: 'categories',
          params: expect.objectContaining({
            facetQuery: 'a',
          }),
        }),
      ]);

      expect(searchClient2.search).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
          indexName: 'indexName',
          query: 'a',
        }),
      ]);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="hits"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"objectID\\":\\"1\\",\\"label\\":\\"Hit 1\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"},\\"__autocomplete_id\\":0}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="facets"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"label\\":\\"Hit 2\\",\\"count\\":2,\\"_highlightResult\\":{\\"label\\":{}},\\"__autocomplete_id\\":1}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="custom"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"label\\":\\"Label 1\\",\\"__autocomplete_id\\":2}",
          "{\\"label\\":\\"Label 2\\",\\"__autocomplete_id\\":3}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="differentClient"]'
          )
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"objectID\\":\\"7\\",\\"label\\":\\"Hit 7\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"},\\"__autocomplete_id\\":4}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="multi"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"objectID\\":\\"3\\",\\"label\\":\\"Hit 3\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"},\\"__autocomplete_id\\":5}",
          "{\\"objectID\\":\\"4\\",\\"label\\":\\"Hit 4\\",\\"__autocomplete_indexName\\":\\"indexName2\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"},\\"__autocomplete_id\\":6}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="multiTypes"]'
          )
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"objectID\\":\\"5\\",\\"label\\":\\"Hit 5\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"},\\"__autocomplete_id\\":7}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="static"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"label\\":\\"Static label 1\\",\\"__autocomplete_id\\":8}",
          "{\\"label\\":\\"Static label 2\\",\\"__autocomplete_id\\":9}",
        ]
      `);
    });
  });

  test('batches calls across requesters with same id', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const searchClient = createSearchClient({
      search: jest.fn((requests) =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>(
            ...requests.map(({ indexName, params: { query } }) => ({
              hits: [{ objectID: '1', label: 'Hit 1' }],
              index: indexName,
              query,
            }))
          )
        )
      ),
    });

    const getResults1 = (params) =>
      createRequester(
        fetchAlgoliaResults,
        'custom-requester-id'
      )({
        transformResponse: (response) => response.hits,
      })(params);

    const getResults2 = (params) =>
      createRequester(
        fetchAlgoliaResults,
        'custom-requester-id'
      )({
        transformResponse: (response) => response.hits,
      })(params);

    const getResults3 = (params) =>
      createRequester(
        fetchAlgoliaResults,
        'different-requester-id'
      )({
        transformResponse: (response) => response.hits,
      })(params);

    const templates = {
      item({ item }) {
        return JSON.stringify(item);
      },
    };

    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getResults1({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates,
          },
          {
            sourceId: 'hits-merged',
            getItems() {
              return getResults2({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates,
          },
          {
            sourceId: 'hits-separate',
            getItems() {
              return getResults3({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates,
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();

      expect(searchClient.search).toHaveBeenCalledTimes(2);
    });
  });

  test('transforms the response before forwarding it to the state', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const searchClient = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>(
            {
              hits: [{ objectID: '1', label: 'Hit 1' }],
            },
            { facetHits: [{ count: 2, value: 'Hit 2' }] }
          )
        )
      ),
    });

    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
                transformResponse({ results, hits }) {
                  return hits.map((hit) => ({
                    ...hit,
                    hitsPerPage: results[0].hitsPerPage,
                  }));
                },
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'facets',
            getItems() {
              return getAlgoliaFacets({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                    },
                  },
                ],
                transformResponse({ results, facetHits }) {
                  return facetHits.map((hit) => ({
                    ...hit,
                    hitsPerPage: results[0].hitsPerPage,
                  }));
                },
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="hits"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"0\\":{\\"objectID\\":\\"1\\",\\"label\\":\\"Hit 1\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"}},\\"hitsPerPage\\":20,\\"__autocomplete_id\\":0}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="facets"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"0\\":{\\"label\\":\\"Hit 2\\",\\"count\\":2,\\"_highlightResult\\":{\\"label\\":{}}},\\"hitsPerPage\\":20,\\"__autocomplete_id\\":1}",
        ]
      `);
    });
  });

  test('properly maps response based on the expected Algolia data type', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const searchClient = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>(
            {
              hits: [{ objectID: '1', label: 'Hit 1' }],
            },
            { facetHits: [{ count: 2, value: 'Hit 2' }] }
          )
        )
      ),
    });

    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
                transformResponse({ results, hits, facetHits }) {
                  return hits.map((hit) => ({
                    ...hit,
                    results,
                    facetHits,
                  }));
                },
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'facets',
            getItems() {
              return getAlgoliaFacets({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                    },
                  },
                ],
                transformResponse({ results, facetHits }) {
                  return facetHits.map((hit) => ({
                    ...hit,
                    results,
                    facetHits,
                  }));
                },
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
        ];
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="hits"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"0\\":{\\"objectID\\":\\"1\\",\\"label\\":\\"Hit 1\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"}},\\"results\\":[{\\"page\\":0,\\"hitsPerPage\\":20,\\"nbHits\\":1,\\"nbPages\\":1,\\"processingTimeMS\\":0,\\"hits\\":[{\\"objectID\\":\\"1\\",\\"label\\":\\"Hit 1\\",\\"__autocomplete_indexName\\":\\"indexName\\",\\"__autocomplete_algoliaCredentials\\":{\\"appId\\":\\"algoliaAppId\\",\\"apiKey\\":\\"algoliaApiKey\\"}}],\\"query\\":\\"\\",\\"params\\":\\"\\",\\"exhaustiveNbHits\\":true,\\"exhaustiveFacetsCount\\":true}],\\"facetHits\\":[],\\"__autocomplete_id\\":0}",
        ]
      `);

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="facets"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"0\\":{\\"label\\":\\"Hit 2\\",\\"count\\":2,\\"_highlightResult\\":{\\"label\\":{}}},\\"results\\":[{\\"page\\":0,\\"hitsPerPage\\":20,\\"nbHits\\":0,\\"nbPages\\":0,\\"processingTimeMS\\":0,\\"hits\\":[],\\"query\\":\\"\\",\\"params\\":\\"\\",\\"exhaustiveNbHits\\":true,\\"exhaustiveFacetsCount\\":true,\\"facetHits\\":[{\\"count\\":2,\\"value\\":\\"Hit 2\\"}]}],\\"facetHits\\":[[{\\"label\\":\\"Hit 2\\",\\"count\\":2,\\"_highlightResult\\":{\\"label\\":{}}}]],\\"__autocomplete_id\\":1}",
        ]
      `);
    });
  });

  test('allows plugins to pass extra parameters to the search client', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    const searchClient = createSearchClient({
      search: jest.fn(() =>
        Promise.resolve(
          createMultiSearchResponse<{ label: string }>(
            {
              hits: [{ objectID: '1', label: 'Hit 1' }],
            },
            { facetHits: [{ count: 2, value: 'Hit 2' }] }
          )
        )
      ),
    });

    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    query,
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
          {
            sourceId: 'facets',
            getItems() {
              return getAlgoliaFacets({
                searchClient,
                queries: [
                  {
                    indexName: 'indexName',
                    facet: 'categories',
                    params: {
                      facetQuery: query,
                    },
                  },
                ],
              });
            },
            templates: {
              item({ item }) {
                return JSON.stringify(item);
              },
            },
          },
        ];
      },
    }).setContext({
      myPlugin: {
        __algoliaSearchParameters: {
          extraParam: true,
        },
      },
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    expect(searchClient.search).toHaveBeenCalledTimes(1);
    expect(searchClient.search).toHaveBeenCalledWith([
      expect.objectContaining({
        params: expect.objectContaining({ extraParam: true }),
      }),
      expect.objectContaining({
        params: expect.objectContaining({ extraParam: true }),
      }),
    ]);
  });
});
