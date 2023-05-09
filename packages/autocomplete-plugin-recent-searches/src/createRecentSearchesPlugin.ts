import { PluginSubscribeParams } from '@algolia/autocomplete-core';
import {
  AutocompleteSource,
  AutocompleteState,
  AutocompletePlugin,
} from '@algolia/autocomplete-js';
import { createRef, MaybePromise, warn } from '@algolia/autocomplete-shared';
import { SearchOptions } from '@algolia/client-search';

import { createStorageApi } from './createStorageApi';
import { getTemplates } from './getTemplates';
import { RecentSearchesItem, Storage, StorageApi } from './types';

export interface RecentSearchesPluginData<TItem extends RecentSearchesItem>
  extends StorageApi<TItem> {
  /**
   * Optimized [Algolia search parameters](https://www.algolia.com/doc/api-reference/search-api-parameters/). This is useful when using the plugin along with the [Query Suggestions](createQuerySuggestionsPlugin) plugin.
   *
   * This function enhances the provided search parameters by:
   * - Excluding Query Suggestions that are already displayed in recent searches.
   * - Using a shared `hitsPerPage` value to get a group limit of Query Suggestions and recent searches.
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createLocalStorageRecentSearchesPlugin/#param-getalgoliasearchparams
   */
  getAlgoliaSearchParams(params?: SearchOptions): SearchOptions;
}

export type CreateRecentSearchesPluginParams<TItem extends RecentSearchesItem> =
  {
    /**
     * The storage to fetch from and save recent searches into.
     *
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createRecentSearchesPlugin/#param-storage
     */
    storage: Storage<TItem>;
    /**
     * A function to transform the provided source.
     *
     * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createRecentSearchesPlugin/#param-transformsource
     */
    transformSource?(params: {
      source: AutocompleteSource<TItem>;
      state: AutocompleteState<TItem>;
      onRemove(id: string): void;
      onTapAhead(item: TItem): void;
    }): AutocompleteSource<TItem>;
    subscribe?(params: PluginSubscribeParams<TItem>): void;
  };

function getDefaultSubscribe<TItem extends RecentSearchesItem>(
  store: StorageApi<TItem>
) {
  return function subscribe({ onSelect }: PluginSubscribeParams<TItem>) {
    onSelect(({ item, state, source }) => {
      const inputValue = source.getItemInputValue({ item, state });

      if (source.sourceId === 'querySuggestionsPlugin' && inputValue) {
        const recentItem: RecentSearchesItem = {
          id: inputValue,
          label: inputValue,
          category: (item as any).__autocomplete_qsCategory,
        };
        store.addItem(recentItem as TItem);
      }
    });
  };
}

export function createRecentSearchesPlugin<TItem extends RecentSearchesItem>(
  options: CreateRecentSearchesPluginParams<TItem>
): AutocompletePlugin<TItem, RecentSearchesPluginData<TItem>> {
  const { storage, transformSource, subscribe } = getOptions(options);
  const store = createStorageApi<TItem>(storage);
  const lastItemsRef = createRef<MaybePromise<TItem[]>>([]);

  return {
    name: 'aa.recentSearchesPlugin',
    subscribe: subscribe ?? getDefaultSubscribe(store),
    onSubmit({ state }) {
      const { query } = state;

      if (query) {
        const recentItem: RecentSearchesItem = {
          id: query,
          label: query,
        };
        store.addItem(recentItem as TItem);
      }
    },
    getSources({ query, setQuery, refresh, state }) {
      lastItemsRef.current = store.getAll(query);

      function onRemove(id: string) {
        store.removeItem(id);
        refresh();
      }

      function onTapAhead(item: TItem) {
        setQuery(item.label);
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
                return item.label;
              },
              getItems() {
                return items;
              },
              templates: getTemplates({ onRemove, onTapAhead }),
            },
            onRemove,
            onTapAhead,
            state: state as AutocompleteState<TItem>,
          }),
        ];
      });
    },
    data: {
      ...store,
      // @ts-ignore SearchOptions `facetFilters` is ReadonlyArray
      getAlgoliaSearchParams(params = {}) {
        // If the items returned by `store.getAll` are contained in a Promise,
        // we cannot provide the search params in time when this function is called
        // because we need to resolve the promise before getting the value.
        if (!Array.isArray(lastItemsRef.current)) {
          warn(
            false,
            'The `getAlgoliaSearchParams` function is not supported with storages that return promises in `getAll`.'
          );
          return params;
        }

        return {
          ...params,
          facetFilters: [
            ...(params.facetFilters ?? []),
            // @TODO: we need to base the filter on the `query` attribute, not
            // `objectID`, because the Query Suggestions index cannot ensure
            // that the `objectID` will always be equal to the query.
            ...lastItemsRef.current.map((item) => [`objectID:-${item.label}`]),
          ],
          hitsPerPage: Math.max(
            1,
            (params.hitsPerPage ?? 10) - lastItemsRef.current.length
          ),
        };
      },
    },
    __autocomplete_pluginOptions: options,
  };
}

function getOptions<TItem extends RecentSearchesItem>(
  options: CreateRecentSearchesPluginParams<TItem>
) {
  return {
    transformSource: ({ source }) => source,
    ...options,
  };
}
