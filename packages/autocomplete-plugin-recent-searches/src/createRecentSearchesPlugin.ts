import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { AutocompleteSource } from '@algolia/autocomplete-js';
import { createRef, MaybePromise, warn } from '@algolia/autocomplete-shared';
import { SearchOptions } from '@algolia/client-search';

import { createStore, RecentSearchesStorage } from './createStore';
import { getTemplates } from './getTemplates';
import { RecentSearchesItem } from './types';

export type RecentSearchesPluginData = {
  getAlgoliaSearchParams(params?: SearchOptions): SearchOptions;
};

export type CreateRecentSearchesPluginParams<
  TItem extends RecentSearchesItem
> = {
  storage: RecentSearchesStorage<TItem>;
  transformSource?(params: {
    source: AutocompleteSource<TItem>;
    onRemove(id: string): void;
  }): AutocompleteSource<TItem>;
};

export function createRecentSearchesPlugin<TItem extends RecentSearchesItem>({
  storage,
  transformSource = ({ source }) => source,
}: CreateRecentSearchesPluginParams<TItem>): AutocompletePlugin<
  TItem,
  RecentSearchesPluginData
> {
  const store = createStore(storage);
  const lastItemsRef = createRef<MaybePromise<TItem[]>>([]);

  return {
    subscribe({ onSelect }) {
      onSelect(({ item, state, source }) => {
        const inputValue = source.getItemInputValue({ item, state });

        if (source.sourceId === 'querySuggestionsPlugin' && inputValue) {
          store.add({
            objectID: inputValue,
            query: inputValue,
            category: (item as any).__autocomplete_qsCategory,
          } as any);
        }
      });
    },
    onSubmit({ state }) {
      const { query } = state;

      if (query) {
        store.add({
          objectID: query,
          query,
        } as any);
      }
    },
    getSources({ query, refresh }) {
      lastItemsRef.current = store.getAll(query);

      function onRemove(id: string) {
        store.remove(id);
        refresh();
      }

      return Promise.resolve(lastItemsRef.current).then((items) => {
        if (items.length === 0) {
          return [];
        }

        return [
          transformSource({
            source: {
              sourceId: 'recentSearchesPlugin',
              getItemInputValue({ item }) {
                return item.query;
              },
              getItems() {
                return items;
              },
              templates: getTemplates({ onRemove }),
            },
            onRemove,
          }),
        ];
      });
    },
    data: {
      // @ts-ignore SearchOptions `facetFilters` is ReadonlyArray
      getAlgoliaSearchParams(params = {}) {
        // If the items returned by `store.getAll` are contained in a Promise,
        // we cannot provide the search params in time when this function is called
        // because we need to resolve the promise before getting the value.
        if (!Array.isArray(lastItemsRef.current)) {
          warn(
            false,
            'The `getAlgoliaQuerySuggestionsFacetFilters` function is not supported with storages that return promises in `getAll`.'
          );
          return params;
        }

        return {
          ...params,
          facetFilters: [
            ...(params.facetFilters ?? []),
            ...lastItemsRef.current.map((item) => [`objectID:-${item.query}`]),
          ],
          hitsPerPage: Math.max(
            1,
            (params.hitsPerPage ?? 10) - lastItemsRef.current.length
          ),
        };
      },
    },
  };
}
