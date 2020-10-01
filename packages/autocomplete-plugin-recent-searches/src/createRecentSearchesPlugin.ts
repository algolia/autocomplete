import { AutocompletePlugin } from '@algolia/autocomplete-core';

import { createRecentSearchesStore } from './createRecentSearchesStore';
import { recentIcon } from './recentIcon';
import { resetIcon } from './resetIcon';

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
    getSources: ({ query, refresh }) => {
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
              const container = document.createElement('div');
              container.className = 'aa-RecentSearchesItem';

              const leftItems = document.createElement('div');
              leftItems.className = 'leftItems';
              const icon = document.createElement('div');
              icon.className = 'item-icon icon';
              icon.innerHTML = recentIcon;
              const title = document.createElement('div');
              title.className = 'title';
              title.innerText = item.query;
              leftItems.appendChild(icon);
              leftItems.appendChild(title);

              const removeButton = document.createElement('button');
              removeButton.className = 'item-icon removeButton';
              removeButton.type = 'button';
              removeButton.innerHTML = resetIcon;
              removeButton.title = 'Remove';

              container.appendChild(leftItems);
              container.appendChild(removeButton);
              root.appendChild(container);

              removeButton.addEventListener('click', (event) => {
                event.stopPropagation();
                store.remove(item);
                refresh();
              });
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
