import { AutocompletePlugin } from '@algolia/autocomplete-js';

import { LOCAL_STORAGE_KEY } from './constants';
import { createLocalStorage } from './createLocalStorage';
import {
  createRecentSearchesPlugin,
  CreateRecentSearchesPluginParams,
  RecentSearchesPluginData,
} from './createRecentSearchesPlugin';
import { search as defaultSearch, SearchParams } from './search';
import { Highlighted, RecentSearchesItem } from './types';

export type CreateRecentSearchesLocalStorageOptions<
  TItem extends RecentSearchesItem
> = {
  /**
   * A local storage key to identify where to save and retrieve the recent searches.
   *
   * For example:
   * - "navbar"
   * - "search"
   * - "main"
   *
   * The plugin namespaces all keys to avoid collisions.
   *
   * @example "top_searchbar"
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createLocalStorageRecentSearchesPlugin/#param-key
   */
  key: string;

  /**
   * The number of recent searches to display.
   *
   * @default 5
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createLocalStorageRecentSearchesPlugin/#param-limit
   */
  limit?: number;

  /**
   * A search function to retrieve recent searches from.
   *
   * This function is called in [`storage.getAll`](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createRecentSearchesPlugin/#param-storage) to retrieve recent searches and is useful to filter and highlight recent searches when typing a query.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-recent-searches/createLocalStorageRecentSearchesPlugin/#param-search
   */
  search?(params: SearchParams<TItem>): Array<Highlighted<TItem>>;
};

type LocalStorageRecentSearchesPluginOptions<TItem extends RecentSearchesItem> =
  Pick<
    CreateRecentSearchesPluginParams<TItem>,
    'transformSource' | 'subscribe'
  > &
    CreateRecentSearchesLocalStorageOptions<TItem>;

export function createLocalStorageRecentSearchesPlugin<
  TItem extends RecentSearchesItem
>(
  options: LocalStorageRecentSearchesPluginOptions<TItem>
): AutocompletePlugin<TItem, RecentSearchesPluginData<TItem>> {
  const { key, limit, transformSource, search, subscribe } =
    getOptions(options);
  const storage = createLocalStorage<TItem>({
    key: [LOCAL_STORAGE_KEY, key].join(':'),
    limit,
    search,
  });

  const recentSearchesPlugin = createRecentSearchesPlugin<TItem>({
    transformSource,
    storage,
    subscribe,
  });

  return {
    ...recentSearchesPlugin,
    name: 'aa.localStorageRecentSearchesPlugin',
    __autocomplete_pluginOptions: options,
  };
}

function getOptions<TItem extends RecentSearchesItem>(
  options: LocalStorageRecentSearchesPluginOptions<TItem>
) {
  return {
    limit: 5,
    search: defaultSearch,
    transformSource: ({ source }) => source,
    ...options,
  };
}
