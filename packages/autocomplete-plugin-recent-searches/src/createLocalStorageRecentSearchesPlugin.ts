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
   * @link https://autocomplete.algolia.com/docs/createLocalStorageRecentSearchesPlugin#key
   */
  key: string;

  /**
   * The number of recent searches to display.
   *
   * @default 5
   * @link https://autocomplete.algolia.com/docs/createLocalStorageRecentSearchesPlugin#limit
   */
  limit?: number;

  /**
   * A search function to retrieve recent searches from.
   *
   * This function is called in [`storage.getAll`](https://autocomplete.algolia.com/docs/createRecentSearchesPlugin#storage) to retrieve recent searches and is useful to filter and highlight recent searches when typing a query.
   *
   * @link https://autocomplete.algolia.com/docs/createLocalStorageRecentSearchesPlugin#search
   */
  search?(params: SearchParams<TItem>): Array<Highlighted<TItem>>;
};

type LocalStorageRecentSearchesPluginOptions<
  TItem extends RecentSearchesItem
> = Pick<
  CreateRecentSearchesPluginParams<TItem>,
  'transformSource' | 'subscribe'
> &
  CreateRecentSearchesLocalStorageOptions<TItem>;

export function createLocalStorageRecentSearchesPlugin<
  TItem extends RecentSearchesItem
>({
  key,
  limit = 5,
  transformSource,
  search = defaultSearch,
  subscribe,
}: LocalStorageRecentSearchesPluginOptions<TItem>): AutocompletePlugin<
  TItem,
  RecentSearchesPluginData<TItem>
> {
  const storage = createLocalStorage({
    key: [LOCAL_STORAGE_KEY, key].join(':'),
    limit,
    search,
  });

  return createRecentSearchesPlugin({
    transformSource,
    storage,
    subscribe,
  });
}
