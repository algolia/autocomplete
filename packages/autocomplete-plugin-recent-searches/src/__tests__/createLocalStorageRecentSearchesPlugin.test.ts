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
        )
          .getAllByRole('option')
          .map((option) => option.querySelector('.aa-ItemContentTitle'))
      ).toMatchInlineSnapshot(`
        Array [
          <div
            class="aa-ItemContentTitle"
          >
            mac
            <mark>
              book
            </mark>
          </div>,
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

    fireEvent.input(input, { target: { value: '' } });

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
              apple tv
            </span>,
            <button>
              Fill with "apple tv"
            </button>,
          ],
          HTMLCollection [
            <span>
              airpods
            </span>,
            <button>
              Fill with "airpods"
            </button>,
          ],
          HTMLCollection [
            <span>
              iphone
            </span>,
            <button>
              Fill with "iphone"
            </button>,
          ],
          HTMLCollection [
            <span>
              ipad
            </span>,
            <button>
              Fill with "ipad"
            </button>,
          ],
          HTMLCollection [
            <span>
              macbook
            </span>,
            <button>
              Fill with "macbook"
            </button>,
          ],
        ]
      `);
    });
  });
});
