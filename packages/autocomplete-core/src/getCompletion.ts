import { InternalAutocompleteOptions, AutocompleteState } from './types';
import { getSelectedItem } from './utils';

interface GetCompletionProps<TItem> {
  state: AutocompleteState<TItem>;
  props: InternalAutocompleteOptions<TItem>;
}

export function getCompletion<TItem>({
  state,
  props,
}: GetCompletionProps<TItem>): string | null {
  if (
    props.enableCompletion === false ||
    state.isOpen === false ||
    state.selectedItemId === null ||
    state.status === 'stalled'
  ) {
    return null;
  }

  const { itemInputValue } = getSelectedItem({ state })!;

  // The completion should appear only if the _first_ characters of the query
  // match with the item.
  if (
    state.query.length > 0 &&
    itemInputValue
      .toLocaleLowerCase()
      .indexOf(state.query.toLocaleLowerCase()) === 0
  ) {
    // If the query typed has a different case than the item, we want
    // to show the completion matching the case of the query. This makes both
    // strings overlap correctly.
    // Example:
    //  - query: 'Gui'
    //  - item: 'guitar'
    //  => completion: 'Guitar'
    const completion = state.query + itemInputValue.slice(state.query.length);

    if (completion === state.query) {
      return null;
    }

    return completion;
  }

  return null;
}
