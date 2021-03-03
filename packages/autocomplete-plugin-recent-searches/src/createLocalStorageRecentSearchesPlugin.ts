import { AutocompletePlugin } from '@algolia/autocomplete-core';

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
   * The unique key to name the store of recent searches.
   *
   * @example "top_searchbar"
   */
  key: string;

  /**
   * The number of recent searches to store.
   *
   * @default 5
   */
  limit?: number;

  /**
   * Function to search in the recent items.
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
