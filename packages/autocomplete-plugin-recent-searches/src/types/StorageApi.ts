import { MaybePromise } from '@algolia/autocomplete-shared';

import { Highlighted } from './Highlighted';
import { RecentSearchesItem } from './RecentSearchesItem';

export type StorageApi<TItem extends RecentSearchesItem> = {
  addItem(item: TItem): void;
  removeItem(id: string): void;
  getAll(query?: string): MaybePromise<Array<Highlighted<TItem>>>;
};
