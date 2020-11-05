import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { SourceTemplates } from '@algolia/autocomplete-js';
import { MaybePromise, warn } from '@algolia/autocomplete-shared';

import { createStore, RecentSearchesStorage } from './createStore';
import {
  getTemplates as defaultGetTemplates,
  GetTemplatesParams,
} from './getTemplates';
import { RecentSearchesItem } from './types';

type Ref<TType> = {
  current: TType;
};

export type RecentSearchesPluginData = {
  getAlgoliaQuerySuggestionsFacetFilters(): string[][];
  getAlgoliaQuerySuggestionsHitsPerPage(hitsPerPage: number): number;
};

export type CreateRecentSearchesPluginParams<
  TItem extends RecentSearchesItem
> = {
  storage: RecentSearchesStorage<TItem>;
  getTemplates?(
    params: GetTemplatesParams
  ): SourceTemplates<TItem>['templates'];
};

export function createRecentSearchesPlugin<TItem extends RecentSearchesItem>({
  storage,
  getTemplates = defaultGetTemplates,
}: CreateRecentSearchesPluginParams<TItem>): AutocompletePlugin<
  TItem,
  RecentSearchesPluginData
> {
  const store = createStore<TItem>(storage);
  const lastItemsRef: Ref<MaybePromise<TItem[]>> = { current: [] };

  return {
    subscribed: {
      onSelect({ item, state, source }) {
        const inputValue = source.getItemInputValue({ item, state });

        if (inputValue) {
          store.add({
            id: inputValue,
            query: inputValue,
          } as TItem);
        }
      },
    },
    onSubmit({ state }) {
      const { query } = state;

      if (query) {
        store.add({
          id: query,
          query,
        } as TItem);
      }
    },
    getSources({ query, refresh }) {
      lastItemsRef.current = store.getAll(query);

      return Promise.resolve(lastItemsRef.current).then((items) => {
        if (items.length === 0) {
          return [];
        }

        return [
          {
            getItemInputValue({ item }) {
              return item.query;
            },
            getItems() {
              return items;
            },
            templates: getTemplates({
              onRemove(id) {
                store.remove(id);
                refresh();
              },
            }),
          },
        ];
      });
    },
    data: {
      getAlgoliaQuerySuggestionsFacetFilters() {
        // If the items returned by `store.getAll` are contained in a Promise,
        // we cannot provide the facet filters in time when this function is called
        // because we need to resolve the promise before getting the value.
        if (!Array.isArray(lastItemsRef.current)) {
          warn(
            'The `getAlgoliaQuerySuggestionsFacetFilters` function is not supported with storages that return promises in `getAll`.'
          );
          return [];
        }

        return lastItemsRef.current.map((item) => [`objectID:-${item.query}`]);
      },
      getAlgoliaQuerySuggestionsHitsPerPage(hitsPerPage: number) {
        // If the items returned by `store.getAll` are contained in a Promise,
        // we cannot provide the number of hits per page in time when this function
        // is called because we need to resolve the promise before getting the value.
        if (!Array.isArray(lastItemsRef.current)) {
          warn(
            'The `getAlgoliaQuerySuggestionsHitsPerPage` function is not supported with storages that return promises in `getAll`.'
          );
          return hitsPerPage;
        }

        return Math.max(1, hitsPerPage - lastItemsRef.current.length);
      },
    },
  };
}
