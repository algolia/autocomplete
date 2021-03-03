import { CreateRecentSearchesLocalStorageOptions } from './createLocalStorageRecentSearchesPlugin';
import { getLocalStorage } from './getLocalStorage';
import { HistoryItem, Storage } from './types';

export type CreateLocalStorageProps<TItem extends HistoryItem> = Required<
  CreateRecentSearchesLocalStorageOptions<TItem>
>;

export function createLocalStorage<TItem extends HistoryItem>({
  key,
  limit,
  search,
}: CreateLocalStorageProps<TItem>): Storage<TItem> {
  const storage = getLocalStorage<TItem>({ key });

  return {
    onAdd(item) {
      storage.setItem([item, ...storage.getItem()]);
    },
    onRemove(id) {
      storage.setItem(storage.getItem().filter((x) => x.id !== id));
    },
    getAll(query = '') {
      return search({ query, items: storage.getItem(), limit }).slice(0, limit);
    },
  };
}
