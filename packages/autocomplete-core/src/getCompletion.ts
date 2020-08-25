import { AutocompleteOptions, AutocompleteState } from './types';
import { getHighlightedItem } from './utils';

interface GetCompletionProps<TItem> {
  state: AutocompleteState<TItem>;
  props: AutocompleteOptions<TItem>;
}

export function getCompletion<TItem>({
  state,
  props,
}: GetCompletionProps<TItem>): string | null {
  if (
    props.enableCompletion === false ||
    state.isOpen === false ||
    state.highlightedIndex === null ||
    state.status === 'stalled'
  ) {
    return null;
  }

  const { itemValue } = getHighlightedItem({ state })!;

  // The completion should appear only if the _first_ characters of the query
  // match with the suggestion.
  if (
    state.query.length > 0 &&
    itemValue.toLocaleLowerCase().indexOf(state.query.toLocaleLowerCase()) === 0
  ) {
    // If the query typed has a different case than the suggestion, we want
    // to show the completion matching the case of the query. This makes both
    // strings overlap correctly.
    // Example:
    //  - query: 'Gui'
    //  - suggestion: 'guitar'
    //  => completion: 'Guitar'
    const completion = state.query + itemValue.slice(state.query.length);

    if (completion === state.query) {
      return null;
    }

    return completion;
  }

  return null;
}
