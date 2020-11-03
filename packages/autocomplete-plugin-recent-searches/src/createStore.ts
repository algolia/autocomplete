import { RecentSearchesItem } from './types/RecentSearchesItem';

// @TODO: reuse MaybePromise from autocomplete-core when we find a way to share the type
export type MaybePromise<TResolution> = Promise<TResolution> | TResolution;

export type RecentSearchesStore<TItem extends RecentSearchesItem> = {
  add(item: TItem): void;
  remove(id: string): void;
  getAll(query?: string): MaybePromise<TItem[]>;
};

type CreateRecentSearchesStoreParams<TItem extends RecentSearchesItem> = {
  onAdd(item: TItem): void;
  onRemove(id: string): void;
  getAll(query?: string): MaybePromise<TItem[]>;
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
