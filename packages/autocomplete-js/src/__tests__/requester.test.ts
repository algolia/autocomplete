import { fireEvent, waitFor, within } from '@testing-library/dom';

import { autocomplete } from '../autocomplete';
import { getAlgoliaResults, getAlgoliaFacets } from '../requesters';
import {
  createMultiSearchResponse,
  createSearchClient,
} from '../../../../test/utils';

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

const searchClient3 = createSearchClient({
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

describe('requester', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  test('batches calls when possible and re-dispatches results to the right sources', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
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

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="custom"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"label\\":\\"Label 1\\",\\"__autocomplete_id\\":0}",
          "{\\"label\\":\\"Label 2\\",\\"__autocomplete_id\\":1}",
        ]
      `);

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

      expect(
        within(
          panelContainer.querySelector('[data-autocomplete-source-id="hits"]')
        )
          .getAllByRole('option')
          .map((node) => node.textContent)
      ).toMatchInlineSnapshot(`
        Array [
          "{\\"objectID\\":\\"1\\",\\"label\\":\\"Hit 1\\",\\"__autocomplete_id\\":2}",
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
          "{\\"label\\":\\"Hit 2\\",\\"count\\":2,\\"_highlightResult\\":{\\"label\\":{}},\\"__autocomplete_id\\":3}",
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
          "{\\"objectID\\":\\"3\\",\\"label\\":\\"Hit 3\\",\\"__autocomplete_id\\":4}",
          "{\\"objectID\\":\\"4\\",\\"label\\":\\"Hit 4\\",\\"__autocomplete_id\\":5}",
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
          "{\\"objectID\\":\\"5\\",\\"label\\":\\"Hit 5\\",\\"__autocomplete_id\\":6}",
        ]
      `);

      expect(searchClient2.search).toHaveBeenNthCalledWith(1, [
        expect.objectContaining({
          indexName: 'indexName',
          query: 'a',
        }),
      ]);

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
          "{\\"objectID\\":\\"7\\",\\"label\\":\\"Hit 7\\",\\"__autocomplete_id\\":7}",
        ]
      `);
    });
  });
  test('transforms the response before forwarding it to the state', async () => {
    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);
    autocomplete({
      container,
      panelContainer,
      getSources({ query }) {
        return [
          {
            sourceId: 'hits',
            getItems() {
              return getAlgoliaResults({
                searchClient: searchClient3,
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
                searchClient: searchClient3,
                queries: [
                  {
                    indexName: 'indexName',
                    type: 'facet',
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
          "{\\"0\\":{\\"objectID\\":\\"1\\",\\"label\\":\\"Hit 1\\"},\\"hitsPerPage\\":20,\\"__autocomplete_id\\":0}",
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
});
