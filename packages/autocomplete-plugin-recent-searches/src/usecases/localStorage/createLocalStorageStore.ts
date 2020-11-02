import { createStore } from '../../createStore';
import { RecentSearchesItem } from '../../types/RecentSearchesItem';

import { createLocalStorage } from './createLocalStorage';

export type CreateLocalStorageRecentSearchesStoreProps = {
  key: string;
  limit: number;
};

export function createLocalStorageStore<TItem extends RecentSearchesItem>({
  key,
  limit,
}: CreateLocalStorageRecentSearchesStoreProps) {
  const storage = createLocalStorage<TItem>({ key });
  const store = createStore<TItem>({
    getAll(query) {
      if (query) {
        return [];
      }

      return storage.getItem().splice(0, limit);
    },
    onAdd(item) {
      storage.setItem([item, ...storage.getItem()]);
    },
    onRemove(id) {
      storage.setItem(storage.getItem().filter((x) => x.id !== id));
    },
  });

  return store;
}
