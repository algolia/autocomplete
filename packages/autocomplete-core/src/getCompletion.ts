import { AutocompleteState } from './types';
import { getSelectedItem } from './utils';

interface GetCompletionProps<TItem> {
  state: AutocompleteState<TItem>;
}

export function getCompletion<TItem>({
  state,
}: GetCompletionProps<TItem>): string | null {
  if (state.isOpen === false || state.selectedItemId === null) {
    return null;
  }

  const { itemInputValue } = getSelectedItem({ state })!;

  return itemInputValue || null;
}
