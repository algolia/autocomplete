import { AutocompleteCollection } from '@algolia/autocomplete-core';

import { createSource } from './createSource';

type CreateCollectionParams<TItem extends Record<string, unknown>> = Partial<{
  source: Partial<AutocompleteCollection<TItem>['source']>;
  items: AutocompleteCollection<TItem>['items'];
}>;

export function createCollection<TItem extends Record<string, unknown>>({
  source,
  items = [],
}: CreateCollectionParams<TItem>): AutocompleteCollection<TItem> {
  return {
    source: createSource<TItem>(source),
    items,
  };
}
