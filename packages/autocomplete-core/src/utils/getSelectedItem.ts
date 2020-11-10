import { AutocompleteCollection, AutocompleteState } from '../types';

// We don't have access to the autocomplete source when we call `onKeyDown`
// or `onClick` because those are native browser events.
// However, we can get the source from the suggestion index.
function getCollectionFromSelectedItemId<TItem>({
  state,
}: {
  state: AutocompleteState<TItem>;
}): AutocompleteCollection<TItem> | undefined {
  // Given 3 sources with respectively 1, 2 and 3 suggestions: [1, 2, 3]
  // We want to get the accumulated counts:
  // [1, 1 + 2, 1 + 2 + 3] = [1, 3, 3 + 3] = [1, 3, 6]
  const accumulatedCollectionsCount = state.collections
    .map((collections) => collections.items.length)
    .reduce<number[]>((acc, collectionsCount, index) => {
      const previousValue = acc[index - 1] || 0;
      const nextValue = previousValue + collectionsCount;

      acc.push(nextValue);

      return acc;
    }, []);

  // Based on the accumulated counts, we can infer the index of the suggestion.
  const collectionIndex = accumulatedCollectionsCount.reduce((acc, current) => {
    if (current <= state.selectedItemId!) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return state.collections[collectionIndex];
}

/**
 * Gets the highlighted index relative to a suggestion object (not the absolute
 * highlighted index).
 *
 * Example:
 *  [['a', 'b'], ['c', 'd', 'e'], ['f']]
 *                      ↑
 *         (absolute: 3, relative: 1)
 */
function getRelativeSelectedItemId<TItem>({
  state,
  collection,
}: {
  state: AutocompleteState<TItem>;
  collection: AutocompleteCollection<TItem>;
}): number {
  let isOffsetFound = false;
  let counter = 0;
  let previousItemsOffset = 0;

  while (isOffsetFound === false) {
    const currentCollection = state.collections[counter];

    if (currentCollection === collection) {
      isOffsetFound = true;
      break;
    }

    previousItemsOffset += currentCollection.items.length;

    counter++;
  }

  return state.selectedItemId! - previousItemsOffset;
}

export function getSelectedItem<TItem>({
  state,
}: {
  state: AutocompleteState<TItem>;
}) {
  const collection = getCollectionFromSelectedItemId({ state });

  if (!collection) {
    return null;
  }

  const item =
    collection.items[getRelativeSelectedItemId({ state, collection })];
  const source = collection.source;
  const itemInputValue = source.getItemInputValue({ item, state });
  const itemUrl = source.getItemUrl({ item, state });

  return {
    item,
    itemInputValue,
    itemUrl,
    source,
  };
}
