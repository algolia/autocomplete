import { Highlighted, RecentSearchesItem } from '../../types';

type HighlightParams<TItem> = {
  item: TItem;
  query: string;
};

type EscapeAndReplace = {
  query: string;
  itemQuery: string;
};

const escapeSpecialChars = new RegExp(/[-/\\^$*+?.()|[\]{}]/g);

function escapeAndReplace({ query, itemQuery }: EscapeAndReplace) {
  return itemQuery.replace(
    new RegExp(query.replace(escapeSpecialChars, '\\$&'), 'g'),
    `__aa-highlight__${query}__/aa-highlight__`
  );
}

function highlight<TItem extends RecentSearchesItem>({
  item,
  query,
}: HighlightParams<TItem>): Highlighted<TItem> {
  return {
    ...item,
    _highlightResult: {
      query: {
        value: query
          ? escapeAndReplace({ query, itemQuery: item.query })
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
}: SearchParams<TItem>): Array<Highlighted<TItem>> {
  if (!query) {
    return items.slice(0, limit).map((item) => highlight({ item, query }));
  }

  return items
    .filter((item) => item.query.toLowerCase().includes(query.toLowerCase()))
    .slice(0, limit)
    .map((item) => highlight({ item, query }));
}
