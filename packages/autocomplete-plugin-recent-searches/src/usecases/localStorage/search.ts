import { RecentSearchesItem } from '../../types';

export type SearchParams<TItem> = {
  query: string;
  items: TItem[];
  limit: number;
};

export function search<TItem extends RecentSearchesItem>({
  query,
  items,
  limit,
}: SearchParams<TItem>) {
  if (!query) {
    return items.slice(0, limit);
  }

  return items
    .filter((item) => item.query.toLowerCase().startsWith(query.toLowerCase()))
    .slice(0, limit);
}
