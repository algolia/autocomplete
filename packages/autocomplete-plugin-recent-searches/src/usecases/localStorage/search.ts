import { RecentSearchesHit, RecentSearchesItem } from '../../types';

type HighlightParams<TItem> = {
  item: TItem;
  query: string;
};

function highlight<TItem extends RecentSearchesItem>({
  item,
  query,
}: HighlightParams<TItem>) {
  return {
    ...item,
    _highlightResult: {
      query: {
        value: query
          ? item.query.replace(
              new RegExp(query, 'g'),
              `__aa-highlight__${query}__/aa-highlight__`
            )
          : item.query,
      },
    },
  };
}

export type SearchParams<TItem> = {
  query: string;
  items: TItem[];
  limit: number;
};

export function search<TItem extends RecentSearchesItem>({
  query,
  items,
  limit,
}: SearchParams<TItem>): RecentSearchesHit[] {
  if (!query) {
    return items.map((item) => highlight({ item, query })).slice(0, limit);
  }

  return items
    .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
    .map((item) => highlight({ item, query }))
    .slice(0, limit);
}
