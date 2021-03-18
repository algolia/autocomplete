import { Highlighted, HistoryItem } from './types';

type HighlightParams<TItem> = {
  item: TItem;
  query: string;
};

export function addHighlightedAttribute<TItem extends HistoryItem>({
  item,
  query,
}: HighlightParams<TItem>): Highlighted<TItem> {
  return {
    ...item,
    _highlightResult: {
      label: {
        value: query
          ? item.label.replace(
              new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'gi'),
              (match) => {
                return `__aa-highlight__${match}__/aa-highlight__`;
              }
            )
          : item.label,
      },
    },
  };
}
