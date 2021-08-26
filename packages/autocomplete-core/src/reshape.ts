import { flatten } from '@algolia/autocomplete-shared';

import {
  AutocompleteCollection,
  AutocompleteReshapeSourcesBySourceId,
  AutocompleteState,
  BaseItem,
  InternalAutocompleteOptions,
} from './types';

type ReshapeParams<TItem extends BaseItem> = {
  collections: Array<AutocompleteCollection<any>>;
  props: InternalAutocompleteOptions<TItem>;
  state: AutocompleteState<TItem>;
};

export function reshape<TItem extends BaseItem>({
  collections,
  props,
  state,
}: ReshapeParams<TItem>) {
  // Sources are grouped by `sourceId` to conveniently pick them via destructuring.
  // Example: `const { recentSearchesPlugin } = sourcesBySourceId`
  const sourcesBySourceId = collections.reduce<
    AutocompleteReshapeSourcesBySourceId<TItem>
  >(
    (acc, collection) => ({
      ...acc,
      [collection.source.sourceId]: {
        ...collection.source,
        getItems() {
          // We provide the resolved items from the collection to the `reshape` prop.
          return flatten<any>(collection.items);
        },
      },
    }),
    {}
  );

  const reshapeSources = props.reshape({
    sources: Object.values(sourcesBySourceId),
    sourcesBySourceId,
    state,
  });

  // We reconstruct the collections with the items modified by the `reshape` prop.
  return flatten(reshapeSources)
    .filter(Boolean)
    .map((source) => {
      return {
        source,
        items: source.getItems(),
      };
    });
}
