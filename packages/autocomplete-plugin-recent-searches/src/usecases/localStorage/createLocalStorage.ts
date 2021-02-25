import { CreateRecentSearchesLocalStorageOptions } from '../../createLocalStorageRecentSearchesPlugin';
import { RecentSearchesStorage } from '../../createStore';
import { RecentSearchesItem } from '../../types/RecentSearchesItem';

import { getLocalStorage } from './getLocalStorage';

export type CreateLocalStorageProps<
  TItem extends RecentSearchesItem
> = Required<CreateRecentSearchesLocalStorageOptions<TItem>>;

export function createLocalStorage<TItem extends RecentSearchesItem>({
  key,
  limit,
  search,
}: CreateLocalStorageProps<TItem>): RecentSearchesStorage<TItem> {
  const storage = getLocalStorage<TItem>({ key });

  return {
    getAll(query = '') {
      return search({ query, items: storage.getItem(), limit }).slice(0, limit);
    },
    onAdd(item) {
      storage.setItem([item, ...storage.getItem()]);
    },
    onRemove(id) {
      storage.setItem(storage.getItem().filter((x) => x.objectID !== id));
    },
  };
}
