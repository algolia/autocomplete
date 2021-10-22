import { createAutocomplete } from '@algolia/autocomplete-core';
import { autocomplete } from '@algolia/autocomplete-js';
import { fireEvent, waitFor, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { createPlayground } from '../../../../test/utils';
import { createLocalStorageRecentSearchesPlugin } from '../createLocalStorageRecentSearchesPlugin';

const recentSearches = [
  {
    id: 'apple tv',
    label: 'apple tv',
  },
  {
    id: 'airpods',
    label: 'airpods',
  },
  {
    id: 'iphone',
    label: 'iphone',
  },
  {
    id: 'ipad',
    label: 'ipad',
  },
  {
    id: 'macbook',
    label: 'macbook',
  },
  {
    id: 'apple watch',
    label: 'apple watch',
  },
];

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  localStorage.clear();
});

describe('createLocalStorageRecentSearchesPlugin', () => {
  test('has a name', () => {
    const plugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
    });

    expect(plugin.name).toBe('aa.localStorageRecentSearchesPlugin');
  });

  test('exposes passed options and excludes default ones', () => {
    const plugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
      limit: 3,
    });

    expect(plugin.__autocomplete_pluginOptions).toEqual({
      key: expect.any(String),
      limit: expect.any(Number),
    });
  });

  test('exposes an API', () => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
    });

    expect(recentSearchesPlugin.data).toEqual({
      getAlgoliaSearchParams: expect.any(Function),
      addItem: expect.any(Function),
      removeItem: expect.any(Function),
      getAll: expect.any(Function),
    });
  });

  test('saves the query on select', () => {
    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
    });

    const { inputElement } = createPlayground(createAutocomplete, {
      plugins: [recentSearchesPlugin],
    });

    inputElement.focus();
    userEvent.type(inputElement, 'a');
    userEvent.type(inputElement, '{enter}');

    expect(
      JSON.parse(
        localStorage.getItem('AUTOCOMPLETE_RECENT_SEARCHES:autocomplete')
      )
    ).toEqual([
      {
        id: 'a',
        label: 'a',
      },
    ]);
  });

  test('limits the number of recent searches to display by default', async () => {
    expect(recentSearches).toHaveLength(6);

    localStorage.setItem(
      'AUTOCOMPLETE_RECENT_SEARCHES:autocomplete',
      JSON.stringify(recentSearches)
    );

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
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

    fireEvent.input(input, { target: { value: '' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="recentSearchesPlugin"]'
          )
        ).getAllByRole('option')
      ).toHaveLength(5);
    });
  });

  test('sets a custom limit of recent searches to display', async () => {
    expect(recentSearches).toHaveLength(6);

    localStorage.setItem(
      'AUTOCOMPLETE_RECENT_SEARCHES:autocomplete',
      JSON.stringify(recentSearches)
    );

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
      limit: 3,
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

    fireEvent.input(input, { target: { value: '' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="recentSearchesPlugin"]'
          )
        ).getAllByRole('option')
      ).toHaveLength(3);
    });
  });

  test('searches through and highlights recent searches by default', async () => {
    localStorage.setItem(
      'AUTOCOMPLETE_RECENT_SEARCHES:autocomplete',
      JSON.stringify(recentSearches)
    );

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
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

    fireEvent.input(input, { target: { value: 'mac' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="recentSearchesPlugin"]'
          )
        ).getAllByRole('option')
      ).toMatchInlineSnapshot(`
        Array [
          <li
            aria-selected="false"
            class="aa-Item"
            id="autocomplete-3-item-0"
            role="option"
          >
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
                    mac
                    <mark>
                      book
                    </mark>
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
                  title="Fill query with \\"macbook\\""
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
            </div>
          </li>,
        ]
      `);
    });
  });

  test('uses a custom search function', () => {
    const search = jest.fn((..._args: any[]) => []);

    localStorage.setItem(
      'AUTOCOMPLETE_RECENT_SEARCHES:autocomplete',
      JSON.stringify(recentSearches)
    );

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
      search,
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

    fireEvent.input(input, { target: { value: 'mac' } });

    expect(search).toHaveBeenCalledWith({
      items: [
        { id: 'apple tv', label: 'apple tv' },
        { id: 'airpods', label: 'airpods' },
        { id: 'iphone', label: 'iphone' },
        { id: 'ipad', label: 'ipad' },
        { id: 'macbook', label: 'macbook' },
        { id: 'apple watch', label: 'apple watch' },
      ],
      limit: 5,
      query: 'mac',
    });
  });

  test('supports custom templates', async () => {
    localStorage.setItem(
      'AUTOCOMPLETE_RECENT_SEARCHES:autocomplete',
      JSON.stringify(recentSearches)
    );

    const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
      key: 'autocomplete',
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

    fireEvent.input(input, { target: { value: '' } });

    await waitFor(() => {
      expect(
        within(
          panelContainer.querySelector(
            '[data-autocomplete-source-id="recentSearchesPlugin"]'
          )
        )
          .getAllByRole('option')
          .map((option) => option.textContent)
      ).toEqual(['apple tv', 'airpods', 'iphone', 'ipad', 'macbook']);
    });
  });
});
