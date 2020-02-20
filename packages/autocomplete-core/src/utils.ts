import {
  AutocompleteState,
  PublicAutocompleteOptions,
  PublicAutocompleteSource,
  AutocompleteSource,
  GetSources,
  AutocompleteSuggestion,
  AutocompleteOptions,
} from './types';

export const noop = () => {};

let autocompleteId = 0;

export function generateAutocompleteId() {
  return `autocomplete-${autocompleteId++}`;
}

export function getItemsCount(state: AutocompleteState<any>) {
  if (state.suggestions.length === 0) {
    return 0;
  }

  return state.suggestions.reduce<number>(
    (sum, suggestion) => sum + suggestion.items.length,
    0
  );
}

export function isSpecialClick(event: MouseEvent): boolean {
  const isMiddleClick = event.button === 1;

  return (
    isMiddleClick ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}

function normalizeSource<TItem>(
  source: PublicAutocompleteSource<TItem>
): AutocompleteSource<TItem> {
  return {
    getInputValue({ state }) {
      return state.query;
    },
    getSuggestionUrl() {
      return undefined;
    },
    onSelect({ setIsOpen }) {
      setIsOpen(false);
    },
    onHighlight: noop,
    ...source,
  };
}

export function normalizeGetSources<TItem>(
  getSources: PublicAutocompleteOptions<TItem>['getSources']
): GetSources<TItem> {
  return options => {
    return Promise.resolve(getSources(options)).then(sources =>
      Promise.all(
        sources.map(source => {
          return Promise.resolve(normalizeSource<TItem>(source));
        })
      )
    );
  };
}

export function getNextHighlightedIndex<TItem>(
  moveAmount: number,
  baseIndex: number | null,
  itemCount: number,
  defaultHighlightedIndex: AutocompleteOptions<TItem>['defaultHighlightedIndex']
): number | null {
  // We allow circular keyboard navigation from the base index.
  // The base index can either be `null` (nothing is highlighted) or `0`
  // (the first item is highlighted).
  // The base index is allowed to get assigned `null` only if
  // `props.defaultHighlightedIndex` is `null`. This pattern allows to "stop"
  // by the actual query before navigating to other suggestions as seen on
  // Google or Amazon.
  if (baseIndex === null && moveAmount < 0) {
    return itemCount - 1;
  }

  if (defaultHighlightedIndex !== null && baseIndex === 0 && moveAmount < 0) {
    return itemCount - 1;
  }

  const numericIndex = (baseIndex === null ? -1 : baseIndex) + moveAmount;

  if (numericIndex <= -1 || numericIndex >= itemCount) {
    return defaultHighlightedIndex === null ? null : 0;
  }

  return numericIndex;
}

// We don't have access to the autocomplete source when we call `onKeyDown`
// or `onClick` because those are native browser events.
// However, we can get the source from the suggestion index.
function getSuggestionFromHighlightedIndex<TItem>({
  state,
}: {
  state: AutocompleteState<TItem>;
}): AutocompleteSuggestion<TItem> {
  // Given 3 sources with respectively 1, 2 and 3 suggestions: [1, 2, 3]
  // We want to get the accumulated counts:
  // [1, 1 + 2, 1 + 2 + 3] = [1, 3, 3 + 3] = [1, 3, 6]
  const accumulatedSuggestionsCount = state.suggestions
    .map(suggestion => suggestion.items.length)
    .reduce<number[]>((acc, suggestionCount, index) => {
      const previousValue = acc[index - 1] || 0;
      const nextValue = previousValue + suggestionCount;

      acc.push(nextValue);

      return acc;
    }, []);

  // Based on the accumulated counts, we can infer the index of the suggestion.
  const suggestionIndex = accumulatedSuggestionsCount.reduce((acc, current) => {
    if (current <= state.highlightedIndex!) {
      return acc + 1;
    }

    return acc;
  }, 0);

  return state.suggestions[suggestionIndex];
}

/**
 * Gets the highlighted index relative to a suggestion object (not the absolute
 * highlighted index).
 *
 * Example:
 *  [['a', 'b'], ['c', 'd', 'e'], ['f']]
 *                      ↑
 *         (absolute: 3, relative: 1)
 * @param param0
 */
function getRelativeHighlightedIndex<TItem>({
  state,
  suggestion,
}: {
  state: AutocompleteState<TItem>;
  suggestion: AutocompleteSuggestion<TItem>;
}): number {
  let isOffsetFound = false;
  let counter = 0;
  let previousItemsOffset = 0;

  while (isOffsetFound === false) {
    const currentSuggestion = state.suggestions[counter];

    if (currentSuggestion === suggestion) {
      isOffsetFound = true;
      break;
    }

    previousItemsOffset += currentSuggestion.items.length;

    counter++;
  }

  return state.highlightedIndex! - previousItemsOffset;
}

export function getHighlightedItem<TItem>({
  state,
}: {
  state: AutocompleteState<TItem>;
}) {
  const suggestion = getSuggestionFromHighlightedIndex({ state });
  const item =
    suggestion.items[getRelativeHighlightedIndex({ state, suggestion })];
  const source = suggestion.source;
  const itemValue = source.getInputValue({ suggestion: item, state });
  const itemUrl = source.getSuggestionUrl({ suggestion: item, state });

  return {
    item,
    itemValue,
    itemUrl,
    source,
  };
}

export function isOrContainsNode(parent: Node, child: Node) {
  return parent === child || (parent.contains && parent.contains(child));
}
