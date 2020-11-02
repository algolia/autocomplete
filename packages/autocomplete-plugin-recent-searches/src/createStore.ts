import { RecentSearchesItem } from './types/RecentSearchesItem';

export type RecentSearchesStore<TItem extends RecentSearchesItem> = {
  add(item: TItem): void;
  remove(id: string): void;
  getAll(query?: string): TItem[];
};

type CreateRecentSearchesStoreParams<TItem extends RecentSearchesItem> = {
  onAdd(item: TItem): void;
  onRemove(id: string): void;
  getAll(query?: string): TItem[];
};

export function createStore<TItem extends RecentSearchesItem>(
  storage: CreateRecentSearchesStoreParams<TItem>
): RecentSearchesStore<TItem> {
  return {
    add(item) {
      storage.onRemove(item.id);
      storage.onAdd(item);
    },
    remove(id) {
      storage.onRemove(id);
    },
    getAll(query) {
      return storage.getAll(query);
    },
  };
}
