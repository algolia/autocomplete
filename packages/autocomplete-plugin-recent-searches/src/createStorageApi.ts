import { HistoryItem, Storage, StorageApi } from './types';

export function createStorageApi<TItem extends HistoryItem>(
  storage: Storage<TItem>
): StorageApi<TItem> {
  return {
    addItem(item) {
      storage.onRemove(item.id);
      storage.onAdd(item);
    },
    removeItem(id) {
      storage.onRemove(id);
    },
    getAll(query) {
      return storage.getAll(query);
    },
  };
}
