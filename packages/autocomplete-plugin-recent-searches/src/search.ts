import { addHighlightedAttribute } from './addHighlightedAttribute';
import { Highlighted, RecentSearchesItem } from './types';

export type SearchParams<TItem extends RecentSearchesItem> = {
  query: string;
  items: TItem[];
  limit: number;
};

export function search<TItem extends RecentSearchesItem>({
  query,
  items,
  limit,
}: SearchParams<TItem>): Array<Highlighted<TItem>> {
  if (!query) {
    return items
      .slice(0, limit)
      .map((item) => addHighlightedAttribute({ item, query }));
  }

  return items
    .filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit)
    .map((item) => addHighlightedAttribute({ item, query }));
}
