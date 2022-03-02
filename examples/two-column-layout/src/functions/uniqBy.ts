import {
  AutocompleteReshapeSource,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteReshapeFunction } from './AutocompleteReshapeFunction';
import { normalizeReshapeSources } from './normalizeReshapeSources';

type UniqByPredicate<TItem extends BaseItem> = (params: {
  source: AutocompleteReshapeSource<TItem>;
  item: TItem;
}) => TItem;

export const uniqBy: AutocompleteReshapeFunction<UniqByPredicate<any>> = <
  TItem extends BaseItem
>(
  predicate: UniqByPredicate<any>
) => {
  return function runUniqBy(...rawSources) {
    const sources = normalizeReshapeSources(rawSources);
    const seen = new Set<TItem>();

    return sources.map((source) => {
      const items = source.getItems().filter((item) => {
        const appliedItem = predicate({ source, item });
        const hasSeen = seen.has(appliedItem);

        seen.add(appliedItem);

        return !hasSeen;
      });

      return {
        ...source,
        getItems() {
          return items;
        },
      };
    });
  };
};
