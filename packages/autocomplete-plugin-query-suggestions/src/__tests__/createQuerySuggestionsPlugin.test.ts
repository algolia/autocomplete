import { createAutocomplete } from '@algolia/autocomplete-core';
import { autocomplete } from '@algolia/autocomplete-js';
import { Hit } from '@algolia/client-search';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  castToJestMock,
  createMultiSearchResponse,
  createPlayground,
  createSearchClient,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createQuerySuggestionsPlugin } from '../createQuerySuggestionsPlugin';

/* eslint-disable @typescript-eslint/camelcase */
const hits: Hit<any> = [
  {
    instant_search: {
      exact_nb_hits: 260,
      facets: {
        exact_matches: {
          categories: [
            {
              value: 'Appliances',
              count: 252,
            },
            {
              value: 'Ranges, Cooktops & Ovens',
              count: 229,
            },
          ],
        },
      },
    },
    nb_words: 1,
    popularity: 1230,
    query: 'cooktop',
    objectID: 'cooktop',
    _highlightResult: {
      query: {
        value: 'cooktop',
        matchLevel: 'none',
        matchedWords: [],
      },
    },
  },
  {
    nb_words: 1,
    popularity: 1230,
    query: 'range',
    objectID: 'range',
    _highlightResult: {
      query: {
        value: 'range',
        matchLevel: 'none',
        matchedWords: [],
      },
    },
  },
];
/* eslint-enable @typescript-eslint/camelcase */

const searchClient = createSearchClient({
  search: jest.fn(() => Promise.resolve(createMultiSearchResponse({ hits }))),
});

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createQuerySuggestionsPlugin', () => {
  test('has a name', () => {
    const plugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
    });

    expect(plugin.name).toBe('aa.querySuggestionsPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      transformSource: ({ source }) => source,
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      searchClient: expect.any(Object),
      indexName: expect.any(String),
      transformSource: expect.any(Function),
    });
  });

  test('adds a source with Query Suggestions and renders the template', async () => {
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="querySuggestionsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <div
              class="aa-ItemWrapper"
            >
              <div
                class="aa-ItemContent"
              >
                <div
                  class="aa-ItemIcon aa-ItemIcon--noBorder"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
                    />
                  </svg>
                </div>
                <div
                  class="aa-ItemContentBody"
                >
                  <div
                    class="aa-ItemContentTitle"
                  >
                    cooktop
                  </div>
                </div>
              </div>
              <div
                class="aa-ItemActions"
              >
                <button
                  class="aa-ItemActionButton"
                  title="Fill query with \\"cooktop\\""
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z"
                    />
                  </svg>
                </button>
              </div>
            </div>,
          ],
          HTMLCollection [
            <div
              class="aa-ItemWrapper"
            >
              <div
                class="aa-ItemContent"
              >
                <div
                  class="aa-ItemIcon aa-ItemIcon--noBorder"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
                    />
                  </svg>
                </div>
                <div
                  class="aa-ItemContentBody"
                >
                  <div
                    class="aa-ItemContentTitle"
                  >
                    range
                  </div>
                </div>
              </div>
              <div
                class="aa-ItemActions"
              >
                <button
                  class="aa-ItemActionButton"
                  title="Fill query with \\"range\\""
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z"
                    />
                  </svg>
                </button>
              </div>
            </div>,
          ],
        ]
      `);
    });
  });

  test('adds categories to suggestions', async () => {
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      categoryAttribute: [
        'instant_search',
        'facets',
        'exact_matches',
        'categories',
      ],
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      const options = within(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="querySuggestionsPlugin"]'
        )
      )
        .getAllByRole('option')
        .map((option) => option.children);

      expect(options).toHaveLength(3);
      expect(options[1]).toMatchInlineSnapshot(`
        HTMLCollection [
          <div
            class="aa-ItemWrapper"
          >
            <div
              class="aa-ItemContent aa-ItemContent--indented"
            >
              <div
                class="aa-ItemContentSubtitle aa-ItemContentSubtitle--standalone"
              >
                <span
                  class="aa-ItemContentSubtitleIcon"
                />
                <span>
                  in
                   
                  <span
                    class="aa-ItemContentSubtitleCategory"
                  >
                    Appliances
                  </span>
                </span>
              </div>
            </div>
          </div>,
        ]
      `);
      expect(options[2]).toMatchInlineSnapshot(`
        HTMLCollection [
          <div
            class="aa-ItemWrapper"
          >
            <div
              class="aa-ItemContent"
            >
              <div
                class="aa-ItemIcon aa-ItemIcon--noBorder"
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16.041 15.856c-0.034 0.026-0.067 0.055-0.099 0.087s-0.060 0.064-0.087 0.099c-1.258 1.213-2.969 1.958-4.855 1.958-1.933 0-3.682-0.782-4.95-2.050s-2.050-3.017-2.050-4.95 0.782-3.682 2.050-4.95 3.017-2.050 4.95-2.050 3.682 0.782 4.95 2.050 2.050 3.017 2.050 4.95c0 1.886-0.745 3.597-1.959 4.856zM21.707 20.293l-3.675-3.675c1.231-1.54 1.968-3.493 1.968-5.618 0-2.485-1.008-4.736-2.636-6.364s-3.879-2.636-6.364-2.636-4.736 1.008-6.364 2.636-2.636 3.879-2.636 6.364 1.008 4.736 2.636 6.364 3.879 2.636 6.364 2.636c2.125 0 4.078-0.737 5.618-1.968l3.675 3.675c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414z"
                  />
                </svg>
              </div>
              <div
                class="aa-ItemContentBody"
              >
                <div
                  class="aa-ItemContentTitle"
                >
                  range
                </div>
              </div>
            </div>
            <div
              class="aa-ItemActions"
            >
              <button
                class="aa-ItemActionButton"
                title="Fill query with \\"range\\""
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M8 17v-7.586l8.293 8.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-8.293-8.293h7.586c0.552 0 1-0.448 1-1s-0.448-1-1-1h-10c-0.552 0-1 0.448-1 1v10c0 0.552 0.448 1 1 1s1-0.448 1-1z"
                  />
                </svg>
              </button>
            </div>
          </div>,
        ]
      `);
    });
  });

  test('adds a single category to the first suggestion by default', async () => {
    castToJestMock(searchClient.search).mockReturnValueOnce(
      Promise.resolve(
        createMultiSearchResponse({
          hits: [...hits, ...hits],
        })
      )
    );

    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      categoryAttribute: [
        'instant_search',
        'facets',
        'exact_matches',
        'categories',
      ],
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="querySuggestionsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual([
        'cooktop', // Query Suggestions item
        'in Appliances', // Category item
        'range', // Query Suggestions item
        'cooktop', // Query Suggestions item
        'range', // Query Suggestions item
      ]);
    });
  });

  test('sets a custom number of items with categories', async () => {
    castToJestMock(searchClient.search).mockReturnValueOnce(
      Promise.resolve(
        createMultiSearchResponse({
          hits: [...hits, ...hits, ...hits],
        })
      )
    );

    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      categoryAttribute: [
        'instant_search',
        'facets',
        'exact_matches',
        'categories',
      ],
      itemsWithCategories: 2,
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="querySuggestionsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual([
        'cooktop', // Query Suggestions item
        'in Appliances', // Category item
        'range', // Query Suggestions item
        'cooktop', // Query Suggestions item
        'in Appliances', // Category item
        'range', // Query Suggestions item
        'cooktop', // Query Suggestions item
        'range', // Query Suggestions item
      ]);
    });
  });

  test('sets a custom number of categories to display per item', async () => {
    castToJestMock(searchClient.search).mockReturnValueOnce(
      Promise.resolve(
        createMultiSearchResponse({
          hits: [...hits, ...hits],
        })
      )
    );

    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      categoryAttribute: [
        'instant_search',
        'facets',
        'exact_matches',
        'categories',
      ],
      categoriesPerItem: 2,
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="querySuggestionsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual([
        'cooktop', // Query Suggestions item
        'in Appliances', // Category item
        'in Ranges, Cooktops & Ovens', // Category item
        'range', // Query Suggestions item
        'cooktop', // Query Suggestions item
        'range', // Query Suggestions item
      ]);
    });
  });

  test('fills the input with the query item key followed by a space on tap ahead', async () => {
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        document.querySelector<HTMLElement>('.aa-Panel')
      ).toBeInTheDocument();
    });

    userEvent.click(
      within(panelContainer).getByRole('button', {
        name: 'Fill query with "cooktop"',
      })
    );

    await runAllMicroTasks();

    await waitFor(() => {
      expect(input.value).toBe('cooktop ');
    });
  });

  test('supports custom templates', async () => {
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            item({ item, createElement, Fragment }) {
              return createElement(
                Fragment,
                null,
                createElement('span', null, item.query),
                createElement('button', null, `Fill with "${item.query}"`)
              );
            },
          },
        };
      },
    });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      plugins: [querySuggestionsPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="querySuggestionsPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <span>
              cooktop
            </span>,
            <button>
              Fill with "cooktop"
            </button>,
          ],
          HTMLCollection [
            <span>
              range
            </span>,
            <button>
              Fill with "range"
            </button>,
          ],
        ]
      `);
    });
  });

  test('supports user search params', async () => {
    const querySuggestionsPlugin = createQuerySuggestionsPlugin({
      searchClient,
      indexName: 'indexName',
      getSearchParams: () => ({ attributesToRetrieve: ['name', 'category'] }),
    });

    const { inputElement } = createPlayground(createAutocomplete, {
      plugins: [querySuggestionsPlugin],
    });

    userEvent.type(inputElement, 'a');

    await runAllMicroTasks();

    expect(searchClient.search).toHaveBeenLastCalledWith([
      {
        indexName: 'indexName',
        query: 'a',
        params: expect.objectContaining({
          attributesToRetrieve: ['name', 'category'],
        }),
      },
    ]);
  });
});
