import { AutocompletePlugin } from '@algolia/autocomplete-core';
import { SourceTemplates } from '@algolia/autocomplete-js';

import { getRecentSearchesPlugin } from './getRecentSearchesPlugin';
import {
  getTemplates as defaultGetTemplates,
  GetTemplatesParams,
} from './getTemplates';
import { RecentSearchesPluginData } from './RecentSearchesPluginData';
import { RecentSearchesItem } from './types';
import { createLocalStorageStore } from './usecases/localStorage';
import { LOCAL_STORAGE_KEY } from './usecases/localStorage/constants';

export type LocalStorageRecentSearchesPluginOptions = {
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

  getTemplates?(
    params: GetTemplatesParams
  ): SourceTemplates<RecentSearchesItem>;
};

export function createLocalStorageRecentSearchesPlugin({
  key,
  limit = 5,
  getTemplates = defaultGetTemplates,
}: LocalStorageRecentSearchesPluginOptions): AutocompletePlugin<
  RecentSearchesItem,
  RecentSearchesPluginData
> {
  const store = createLocalStorageStore({
    key: [LOCAL_STORAGE_KEY, key].join(':'),
    limit,
  });

  return getRecentSearchesPlugin({
    getTemplates,
    store,
  });
}
