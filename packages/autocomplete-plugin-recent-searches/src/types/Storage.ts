import { MaybePromise } from '@algolia/autocomplete-shared';

import { Highlighted } from './Highlighted';
import { RecentSearchesItem } from './RecentSearchesItem';

export type Storage<TItem extends RecentSearchesItem> = {
  onAdd(item: TItem): void;
  onRemove(id: string): void;
  getAll(query?: string): MaybePromise<Array<Highlighted<TItem>>>;
};
