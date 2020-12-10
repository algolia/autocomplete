import { AutocompleteState, BaseItem } from './types';
import { getSelectedItem } from './utils';

interface GetCompletionProps<TItem extends BaseItem> {
  state: AutocompleteState<TItem>;
}

export function getCompletion<TItem extends BaseItem>({
  state,
}: GetCompletionProps<TItem>): string | null {
  if (state.isOpen === false || state.selectedItemId === null) {
    return null;
  }

  const { itemInputValue } = getSelectedItem(state)!;

  return itemInputValue || null;
}
