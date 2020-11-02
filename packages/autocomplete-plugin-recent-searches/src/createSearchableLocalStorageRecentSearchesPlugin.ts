import { AutocompletePlugin } from '@algolia/autocomplete-core';

import { LocalStorageRecentSearchesPluginOptions } from './createLocalStorageRecentSearchesPlugin';
import { getRecentSearchesPlugin } from './getRecentSearchesPlugin';
import { getTemplates as defaultGetTemplates } from './getTemplates';
import { RecentSearchesPluginData } from './RecentSearchesPluginData';
import { RecentSearchesItem } from './types';
import { createSearchableLocalStorageStore } from './usecases/localStorage';
import { LOCAL_STORAGE_KEY } from './usecases/localStorage/constants';

export function createSearchableLocalStorageRecentSearchesPlugin({
  key,
  limit = 5,
  getTemplates = defaultGetTemplates,
}: LocalStorageRecentSearchesPluginOptions): AutocompletePlugin<
  RecentSearchesItem,
  RecentSearchesPluginData
> {
  const store = createSearchableLocalStorageStore({
    key: [LOCAL_STORAGE_KEY, key].join(':'),
    limit,
  });

  return getRecentSearchesPlugin({
    getTemplates,
    store,
  });
}
