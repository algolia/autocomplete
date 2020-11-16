import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { SourceTemplates } from '@algolia/autocomplete-js';
import { MaybePromise, warn } from '@algolia/autocomplete-shared';
import { SearchOptions } from '@algolia/client-search';

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
  getAlgoliaSearchParams(params?: SearchOptions): SearchOptions;
};

export type CreateRecentSearchesPluginParams<
  TItem extends RecentSearchesItem
> = {
  storage: RecentSearchesStorage<TItem>;
  getTemplates?(params: GetTemplatesParams): SourceTemplates<TItem>;
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
