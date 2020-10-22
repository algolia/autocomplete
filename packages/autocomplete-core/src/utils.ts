import {
  InternalAutocompleteOptions,
  InternalAutocompleteSource,
  AutocompleteState,
  AutocompleteCollection,
  AutocompleteOptions,
  AutocompleteSource,
} from './types';

export const noop = () => {};

let autocompleteId = 0;

export function generateAutocompleteId() {
  return `autocomplete-${autocompleteId++}`;
}

export function getItemsCount(state: AutocompleteState<any>) {
  if (state.collections.length === 0) {
    return 0;
  }

  return state.collections.reduce<number>(
    (sum, collection) => sum + collection.items.length,
    0
  );
}

function normalizeSource<TItem>(
  source: AutocompleteSource<TItem>
): InternalAutocompleteSource<TItem> {
  return {
    getItemInputValue({ state }) {
      return state.query;
    },
    getItemUrl() {
      return undefined;
    },
    onSelect({ setIsOpen }) {
      setIsOpen(false);
    },
    onHighlight: noop,
    ...source,
  };
}

export function getNormalizedSources<TItem>(
  getSources: AutocompleteOptions<TItem>['getSources'],
  options
): Promise<Array<InternalAutocompleteSource<TItem>>> {
  return Promise.resolve(getSources(options)).then((sources) =>
    Promise.all(
      sources.filter(Boolean).map((source) => {
        return Promise.resolve(normalizeSource<TItem>(source));
      })
    )
  );
}

export function getNextSelectedItemId<TItem>(
  moveAmount: number,
  baseIndex: number | null,
  itemCount: number,
  defaultSelectedItemId: InternalAutocompleteOptions<
    TItem
  >['defaultSelectedItemId']
): number | null {
  // We allow circular keyboard navigation from the base index.
  // The base index can either be `null` (nothing is highlighted) or `0`
  // (the first item is highlighted).
  // The base index is allowed to get assigned `null` only if
  // `props.defaultSelectedItemId` is `null`. This pattern allows to "stop"
  // by the actual query before navigating to other suggestions as seen on
  // Google or Amazon.
  if (baseIndex === null && moveAmount < 0) {
    return itemCount - 1;
  }

  if (defaultSelectedItemId !== null && baseIndex === 0 && moveAmount < 0) {
    return itemCount - 1;
  }

  const numericIndex = (baseIndex === null ? -1 : baseIndex) + moveAmount;

  if (numericIndex <= -1 || numericIndex >= itemCount) {
    return defaultSelectedItemId === null ? null : 0;
  }

  return numericIndex;
}

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
  const accumulatedCollectionssCount = state.collections
    .map((collections) => collections.items.length)
    .reduce<number[]>((acc, collectionsCount, index) => {
      const previousValue = acc[index - 1] || 0;
      const nextValue = previousValue + collectionsCount;

      acc.push(nextValue);

      return acc;
    }, []);

  // Based on the accumulated counts, we can infer the index of the suggestion.
  const collectionIndex = accumulatedCollectionssCount.reduce(
    (acc, current) => {
      if (current <= state.selectedItemId!) {
        return acc + 1;
      }

      return acc;
    },
    0
  );

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

export function isOrContainsNode(parent: Node, child: Node) {
  return parent === child || (parent.contains && parent.contains(child));
}
