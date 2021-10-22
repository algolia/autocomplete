import { createAutocomplete } from '@algolia/autocomplete-core';
import { autocomplete } from '@algolia/autocomplete-js';
import { createQuerySuggestionsPlugin } from '@algolia/autocomplete-plugin-query-suggestions';
import { noop } from '@algolia/autocomplete-shared';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import {
  createMultiSearchResponse,
  createPlayground,
  createSearchClient,
  runAllMicroTasks,
} from '../../../../test/utils';
import { createRecentSearchesPlugin } from '../createRecentSearchesPlugin';
import { RecentSearchesItem, Storage } from '../types';

const searchClient = createSearchClient({
  search: jest.fn(() =>
    Promise.resolve(
      createMultiSearchResponse({
        hits: [
          {
            // eslint-disable-next-line @typescript-eslint/camelcase
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
        ],
      })
    )
  ),
});

function createInMemoryStorage<TItem extends RecentSearchesItem>(
  initialItems: TItem[] = []
): Storage<TItem> {
  let storage = [...initialItems];

  return {
    onAdd(item) {
      storage.push(item);
    },
    onRemove(id) {
      storage = storage.filter((item) => item.id !== id);
    },
    getAll() {
      return storage.map((item) => ({
        ...item,
        _highlightResult: {
          label: {
            value: item.label,
          },
        },
      }));
    },
  };
}

const noopStorage = { onAdd: noop, onRemove: noop, getAll: () => [] };

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createRecentSearchesPlugin', () => {
  test('has a name', () => {
    const plugin = createRecentSearchesPlugin({
      storage: noopStorage,
    });

    expect(plugin.name).toBe('aa.recentSearchesPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createRecentSearchesPlugin({
      storage: noopStorage,
      transformSource: ({ source }) => source,
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      storage: expect.any(Object),
      transformSource: expect.any(Function),
    });
  });

  test('exposes an API', () => {
    const recentSearchesPlugin = createRecentSearchesPlugin({
      storage: noopStorage,
    });

    expect(recentSearchesPlugin.data).toEqual({
      getAlgoliaSearchParams: expect.any(Function),
      addItem: expect.any(Function),
      removeItem: expect.any(Function),
      getAll: expect.any(Function),
    });
  });

  test('saves the query on select', () => {
    const storage = createInMemoryStorage();
    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const { inputElement } = createPlayground(createAutocomplete, {
      plugins: [recentSearchesPlugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');
    userEvent.type(inputElement, '{enter}');

    expect(storage.getAll()).toEqual([
      {
        id: 'a',
        label: 'a',
        _highlightResult: {
          label: {
            value: 'a',
          },
        },
      },
    ]);
  });

  test('saves the query on submit', () => {
    const storage = createInMemoryStorage();
    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const { inputElement, formElement } = createPlayground(createAutocomplete, {
      plugins: [recentSearchesPlugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');
    formElement.submit();

    expect(storage.getAll()).toEqual([
      {
        id: 'a',
        label: 'a',
        _highlightResult: {
          label: {
            value: 'a',
          },
        },
      },
    ]);
  });

  test('does not save empty query on submit', () => {
    const storage = createInMemoryStorage();
    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const { inputElement, formElement } = createPlayground(createAutocomplete, {
      plugins: [recentSearchesPlugin],
    });

    inputElement.focus();
    formElement.submit();

    expect(storage.getAll()).toEqual([]);
  });

  test('does not add source without recent searches', async () => {
    const storage = createInMemoryStorage();
    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      openOnFocus: true,
      plugins: [recentSearchesPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="recentSearchesPlugin"]'
        )
      ).toBeNull();
    });
  });

  test('adds source with recent searches and renders the template', async () => {
    const storage = createInMemoryStorage([
      {
        id: 'query',
        label: 'query',
      },
    ]);

    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      openOnFocus: true,
      plugins: [recentSearchesPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="recentSearchesPlugin"]'
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
                      d="M12.516 6.984v5.25l4.5 2.672-0.75 1.266-5.25-3.188v-6h1.5zM12 20.016q3.281 0 5.648-2.367t2.367-5.648-2.367-5.648-5.648-2.367-5.648 2.367-2.367 5.648 2.367 5.648 5.648 2.367zM12 2.016q4.125 0 7.055 2.93t2.93 7.055-2.93 7.055-7.055 2.93-7.055-2.93-2.93-7.055 2.93-7.055 7.055-2.93z"
                    />
                  </svg>
                </div>
                <div
                  class="aa-ItemContentBody"
                >
                  <div
                    class="aa-ItemContentTitle"
                  >
                    query
                  </div>
                </div>
              </div>
              <div
                class="aa-ItemActions"
              >
                <button
                  class="aa-ItemActionButton"
                  title="Remove this search"
                >
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18 7v13c0 0.276-0.111 0.525-0.293 0.707s-0.431 0.293-0.707 0.293h-10c-0.276 0-0.525-0.111-0.707-0.293s-0.293-0.431-0.293-0.707v-13zM17 5v-1c0-0.828-0.337-1.58-0.879-2.121s-1.293-0.879-2.121-0.879h-4c-0.828 0-1.58 0.337-2.121 0.879s-0.879 1.293-0.879 2.121v1h-4c-0.552 0-1 0.448-1 1s0.448 1 1 1h1v13c0 0.828 0.337 1.58 0.879 2.121s1.293 0.879 2.121 0.879h10c0.828 0 1.58-0.337 2.121-0.879s0.879-1.293 0.879-2.121v-13h1c0.552 0 1-0.448 1-1s-0.448-1-1-1zM9 5v-1c0-0.276 0.111-0.525 0.293-0.707s0.431-0.293 0.707-0.293h4c0.276 0 0.525 0.111 0.707 0.293s0.293 0.431 0.293 0.707v1zM9 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1zM13 11v6c0 0.552 0.448 1 1 1s1-0.448 1-1v-6c0-0.552-0.448-1-1-1s-1 0.448-1 1z"
                    />
                  </svg>
                </button>
                <button
                  class="aa-ItemActionButton"
                  title="Fill query with \\"query\\""
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

  test('supports custom templates', async () => {
    const storage = createInMemoryStorage([
      {
        id: 'query',
        label: 'query',
      },
    ]);

    const recentSearchesPlugin = createRecentSearchesPlugin({
      storage,
      transformSource({ source }) {
        return {
          ...source,
          templates: {
            item({ item, createElement, Fragment }) {
              return createElement(
                Fragment,
                null,
                createElement('span', null, item.label),
                createElement('button', null, `Fill with "${item.label}"`)
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
      openOnFocus: true,
      plugins: [recentSearchesPlugin],
    });

    const input = container.querySelector<HTMLInputElement>('.aa-Input');

    fireEvent.input(input, { target: { value: 'a' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="recentSearchesPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.children)
      ).toMatchInlineSnapshot(`
        Array [
          HTMLCollection [
            <span>
              query
            </span>,
            <button>
              Fill with "query"
            </button>,
          ],
        ]
      `);
    });
  });

  test('removes the recent search on remove button click', async () => {
    const storage = createInMemoryStorage([
      {
        id: 'query',
        label: 'query',
      },
    ]);

    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      openOnFocus: true,
      plugins: [recentSearchesPlugin],
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
        name: 'Remove this search',
      })
    );

    await runAllMicroTasks();

    await waitFor(() => {
      expect(
        panelContainer.querySelector(
          '[data-autocomplete-source-id="recentSearchesPlugin"]'
        )
      ).toBeNull();
    });
  });

  test('fills the input with the recent search label on tap ahead', async () => {
    const storage = createInMemoryStorage([
      {
        id: 'query',
        label: 'query',
      },
    ]);

    const recentSearchesPlugin = createRecentSearchesPlugin({ storage });

    const container = document.createElement('div');
    const panelContainer = document.createElement('div');

    document.body.appendChild(panelContainer);

    autocomplete({
      container,
      panelContainer,
      openOnFocus: true,
      plugins: [recentSearchesPlugin],
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
        name: 'Fill query with "query"',
      })
    );

    await runAllMicroTasks();

    await waitFor(() => {
      expect(input.value).toBe('query');
    });
  });

  test('exposes `getAlgoliaSearchParams` with defaults', () => {
    const plugin = createRecentSearchesPlugin({ storage: noopStorage });

    expect(plugin.data.getAlgoliaSearchParams()).toEqual({
      facetFilters: [],
      hitsPerPage: 10,
    });
  });

  test('exposes `getAlgoliaSearchParams` with custom search options', () => {
    const plugin = createRecentSearchesPlugin({ storage: noopStorage });

    expect(
      plugin.data.getAlgoliaSearchParams({
        attributesToRetrieve: ['name', 'category'],
        facetFilters: ['category:Book'],
        hitsPerPage: 8,
      })
    ).toEqual({
      attributesToRetrieve: ['name', 'category'],
      facetFilters: ['category:Book'],
      hitsPerPage: 8,
    });
  });

  test('adjusts search parameters based on existing recent searches', () => {
    const recentSearchesPlugin = createRecentSearchesPlugin({
      storage: {
        onAdd: noop,
        onRemove: noop,
        getAll: () => [
          {
            id: 'query',
            label: 'query',
            _highlightResult: {
              label: {
                value: 'query',
              },
            },
          },
        ],
      },
    });

    const { inputElement } = createPlayground(createAutocomplete, {
      plugins: [recentSearchesPlugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    expect(
      recentSearchesPlugin.data.getAlgoliaSearchParams({
        facetFilters: ['category:Book'],
        hitsPerPage: 8,
      })
    ).toEqual({
      facetFilters: ['category:Book', ['objectID:-query']],
      hitsPerPage: 7,
    });
  });

  test('displays at least one recent search', () => {
    const recentSearchesPlugin = createRecentSearchesPlugin({
      storage: {
        onAdd: noop,
        onRemove: noop,
        getAll: () => [
          {
            id: 'query',
            label: 'query',
            _highlightResult: {
              label: {
                value: 'query',
              },
            },
          },
        ],
      },
    });

    const { inputElement } = createPlayground(createAutocomplete, {
      plugins: [recentSearchesPlugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');

    expect(
      recentSearchesPlugin.data.getAlgoliaSearchParams({
        facetFilters: ['category:Book'],
        hitsPerPage: 1,
      })
    ).toEqual(
      expect.objectContaining({
        hitsPerPage: 1,
      })
    );
  });

  describe('Query Suggestions plugin', () => {
    test('saves the suggestion as a recent search on select', async () => {
      const storage = createInMemoryStorage();
      const recentSearchesPlugin = createRecentSearchesPlugin({ storage });
      const querySuggestionsPlugin = createQuerySuggestionsPlugin({
        searchClient,
        indexName: 'instant_search',
        getSearchParams() {
          return recentSearchesPlugin.data.getAlgoliaSearchParams();
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        openOnFocus: true,
        defaultActiveItemId: 0,
        plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      });

      inputElement.focus();

      await runAllMicroTasks();

      userEvent.type(inputElement, '{enter}');

      await runAllMicroTasks();

      expect(storage.getAll()).toEqual([
        {
          _highlightResult: {
            label: {
              value: 'cooktop',
            },
          },
          category: undefined,
          id: 'cooktop',
          label: 'cooktop',
        },
      ]);
    });

    test('does not save the query on select without item input value', async () => {
      const storage = createInMemoryStorage();
      const recentSearchesPlugin = createRecentSearchesPlugin({ storage });
      const querySuggestionsPlugin = createQuerySuggestionsPlugin({
        searchClient,
        indexName: 'instant_search',
        getSearchParams() {
          return recentSearchesPlugin.data.getAlgoliaSearchParams();
        },
        transformSource({ source }) {
          return {
            ...source,
            getItemInputValue: () => undefined,
          };
        },
      });

      const { inputElement } = createPlayground(createAutocomplete, {
        openOnFocus: true,
        defaultActiveItemId: 0,
        plugins: [recentSearchesPlugin, querySuggestionsPlugin],
      });

      inputElement.focus();

      await runAllMicroTasks();

      userEvent.type(inputElement, '{enter}');

      await runAllMicroTasks();

      expect(storage.getAll()).toEqual([]);
    });
  });
});
