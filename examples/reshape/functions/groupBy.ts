import { BaseItem } from '@algolia/autocomplete-core';
import { AutocompleteSource } from '@algolia/autocomplete-js';
import { flatten } from '@algolia/autocomplete-shared';

import { AutocompleteReshapeFunction } from './AutocompleteReshapeFunction';
import { normalizeReshapeSources } from './normalizeReshapeSources';

export type GroupByOptions<
  TItem extends BaseItem,
  TSource extends AutocompleteSource<TItem>
> = {
  getSource(params: { name: string; items: TItem[] }): Partial<TSource>;
};

export const groupBy: AutocompleteReshapeFunction = <
  TItem extends BaseItem,
  TSource extends AutocompleteSource<TItem> = AutocompleteSource<TItem>
>(
  predicate: (value: TItem) => string,
  options: GroupByOptions<TItem, TSource>
) => {
  return function runGroupBy(...rawSources) {
    const sources = normalizeReshapeSources(rawSources);

    if (sources.length === 0) {
      return [];
    }

    // Since we create multiple sources from a single one, we take the first one
    // as reference to create the new sources from.
    const referenceSource = sources[0];
    const items = flatten(sources.map((source) => source.getItems()));
    const groupedItems = items.reduce<Record<string, TItem[]>>((acc, item) => {
      const key = predicate(item as TItem);

      if (!acc.hasOwnProperty(key)) {
        acc[key] = [];
      }

      acc[key].push(item as TItem);

      return acc;
    }, {});

    return Object.entries(groupedItems).map(([groupName, groupItems]) => {
      const userSource = options.getSource({
        name: groupName,
        items: groupItems,
      });

      return {
        ...referenceSource,
        sourceId: groupName,
        getItems() {
          return groupItems;
        },
        ...userSource,
        templates: {
          ...((referenceSource as any).templates as any),
          ...(userSource as any).templates,
        },
      };
    });
  };
};
