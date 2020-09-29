import { AutocompletePlugin } from '@algolia/autocomplete-core';

import { createRecentSearchesStore } from './createRecentSearchesStore';

type PluginOptions = {
  /**
   * The number of searches to store.
   *
   * @default 5
   */
  limit?: number;

  /**
   * The key to distinguish multiple stores of recent searches.
   *
   * @example
   * // 'top_searchbar'
   */
  key: string;
};

type RecentSearchItem = {
  objectID: string;
  query: string;
};

type PluginData = {
  getFacetFilters: () => string[];
};

export function createRecentSearchesPlugin({
  key,
  limit = 5,
}: PluginOptions): AutocompletePlugin<RecentSearchItem, PluginData> {
  const store = createRecentSearchesStore({
    key: ['AUTOCOMPLETE_RECENT_SEARCHES', key].join('__'),
    limit,
  });

  return {
    getSources: ({ query }) => {
      if (query) {
        return [];
      }

      return [
        {
          getInputValue: ({ suggestion }) => suggestion.query,
          getSuggestions() {
            return store.getAll();
          },
          templates: {
            item({ item, root }) {
              const div = document.createElement('div');
              div.className = 'autocomplete-item';
              div.innerHTML = `
                <div>
                  <svg viewBox="0 0 22 22" width="16" height="16" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                  </svg>

                  <span>${item.query}</span>
                </div>
                <div>
                  <button type="button" class="autocomplete-recent-search-delete">X</button>
                </div>
              `;
              root.appendChild(div);
              div.addEventListener('click', (event: MouseEvent) => {
                if (
                  event!.target &&
                  (event!.target as HTMLElement).classList.contains(
                    'autocomplete-recent-search-delete'
                  )
                ) {
                  event.stopPropagation();
                  store.remove(item);
                  // FIXME: how to refresh only this plugin without having to refresh all the other sources?
                }
              });
              return null;
            },
          },
        },
      ];
    },
    onSubmit: ({ state }) => {
      const { query } = state;
      if (query) {
        store.add({
          objectID: query,
          query,
        });
      }
    },
    onSelect: ({ suggestion, state, source }) => {
      const inputValue = source.getInputValue({ suggestion, state });
      const { objectID } = suggestion as any;
      if (inputValue) {
        store.add({
          objectID: objectID || inputValue,
          query: inputValue,
        });
      }
    },
    data: {
      getFacetFilters: () => {
        return store.getAll().map((item) => [`objectID:-${item.query}`]);
      },
    },
  };
}
