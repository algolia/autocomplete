import { createStore } from '../../createStore';
import { RecentSearchesItem } from '../../types/RecentSearchesItem';

import { createLocalStorage } from './createLocalStorage';

export type CreateSearchableLocalStorageRecentSearchesStoreProps = {
  key: string;
  limit: number;
};

export function createSearchableLocalStorageStore<
  TItem extends RecentSearchesItem
>({ key, limit }: CreateSearchableLocalStorageRecentSearchesStoreProps) {
  const storage = createLocalStorage<TItem>({ key });
  const store = createStore<TItem>({
    getAll(query) {
      if (query) {
        return storage
          .getItem()
          .filter((item) =>
            item.query.toLowerCase().startsWith(query.toLowerCase())
          )
          .splice(0, limit);
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
