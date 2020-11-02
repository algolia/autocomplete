import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { SourceTemplates } from '@algolia/autocomplete-js';

import { RecentSearchesStore } from './createStore';
import { GetTemplatesParams } from './getTemplates';
import { RecentSearchesPluginData } from './RecentSearchesPluginData';
import { RecentSearchesItem } from './types';

type GetRecentSearchesPluginParams = {
  getTemplates(params: GetTemplatesParams): SourceTemplates<RecentSearchesItem>;
  store: RecentSearchesStore<RecentSearchesItem>;
};

export function getRecentSearchesPlugin({
  getTemplates,
  store,
}: GetRecentSearchesPluginParams): AutocompletePlugin<
  RecentSearchesItem,
  RecentSearchesPluginData
> {
  const lastQueryRef = { current: '' };

  return {
    subscribed: {
      onSelect({ item, state, source }) {
        const inputValue = source.getItemInputValue({ item, state });

        if (inputValue) {
          store.add({
            id: inputValue,
            query: inputValue,
          });
        }
      },
    },
    onStateChange({ state }) {
      lastQueryRef.current = state.query;
    },
    onSubmit({ state }) {
      const { query } = state;

      if (query) {
        store.add({
          id: query,
          query,
        });
      }
    },
    getSources({ query, refresh }) {
      return [
        {
          getItemInputValue({ item }) {
            return item.query;
          },
          getItems() {
            return store.getAll(query);
          },
          templates: getTemplates({
            onRemove(id) {
              store.remove(id);
              refresh();
            },
          }),
        },
      ];
    },
    data: {
      getQuerySuggestionsFacetFilters() {
        return store
          .getAll(lastQueryRef.current)
          .map((item) => [`objectID:-${item.query}`]);
      },
      getQuerySuggestionsHitsPerPage(hitsPerPage: number) {
        return Math.max(
          1,
          hitsPerPage - store.getAll(lastQueryRef.current).length
        );
      },
    },
  };
}
