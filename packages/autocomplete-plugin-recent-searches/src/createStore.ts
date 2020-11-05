import { MaybePromise } from '@algolia/autocomplete-shared';

import { RecentSearchesItem } from './types/RecentSearchesItem';

export type RecentSearchesStore<TItem extends RecentSearchesItem> = {
  add(item: TItem): void;
  remove(id: string): void;
  getAll(query?: string): MaybePromise<TItem[]>;
};

export type RecentSearchesStorage<TItem extends RecentSearchesItem> = {
  onAdd(item: TItem): void;
  onRemove(id: string): void;
  getAll(query?: string): MaybePromise<TItem[]>;
};

export function createStore<TItem extends RecentSearchesItem>(
  storage: RecentSearchesStorage<TItem>
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
