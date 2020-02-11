import {
  AutocompleteState,
  AutocompleteOptions,
  Suggestion,
  AutocompleteSource,
  NormalizedGetSources,
} from './types';

export const noop = () => {};

let autocompleteId = 0;

export function generateAutocompleteId() {
  return `autocomplete-${autocompleteId++}`;
}

export function getItemsCount(state: AutocompleteState<unknown>) {
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

function normalizeSource(source: AutocompleteSource) {
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
    ...source,
  };
}

export function normalizeGetSources<TItem>(
  getSources: AutocompleteOptions<TItem>['getSources']
): NormalizedGetSources {
  return options => {
    return Promise.resolve(getSources(options)).then(sources =>
      Promise.all(
        sources.map(source => {
          return Promise.resolve(normalizeSource(source));
        })
      )
    );
  };
}

export function getNextHighlightedIndex(
  moveAmount: number,
  baseIndex: number,
  itemCount: number
) {
  const itemsLastIndex = itemCount - 1;

  if (
    typeof baseIndex !== 'number' ||
    baseIndex < 0 ||
    baseIndex >= itemCount
  ) {
    baseIndex = moveAmount > 0 ? -1 : itemsLastIndex + 1;
  }

  let newIndex = baseIndex + moveAmount;

  if (newIndex < 0) {
    newIndex = itemsLastIndex;
  } else if (newIndex > itemsLastIndex) {
    newIndex = 0;
  }

  return newIndex;
}

// We don't have access to the autocomplete source when we call `onKeyDown`
// or `onClick` because those are native browser events.
// However, we can get the source from the suggestion index.
export function getSuggestionFromHighlightedIndex<TItem>({
  state,
}: {
  state: AutocompleteState<TItem>;
}): AutocompleteSource | undefined {
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
    if (current <= state.highlightedIndex) {
      return acc + 1;
    }

    return acc;
  }, 0);

  const suggestion: Suggestion<TItem> | undefined =
    state.suggestions[suggestionIndex];

  return suggestion;
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
export function getRelativeHighlightedIndex({ state, suggestion }): number {
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

  return state.highlightedIndex - previousItemsOffset;
}
