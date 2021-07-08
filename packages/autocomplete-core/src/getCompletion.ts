import { AutocompleteState, BaseItem } from './types';
import { getActiveItem } from './utils';

interface GetCompletionProps<TItem extends BaseItem> {
  state: AutocompleteState<TItem>;
}

export function getCompletion<TItem extends BaseItem>({
  state,
}: GetCompletionProps<TItem>): string | null {
  if (state.isOpen === false || state.activeItemId === null) {
    return null;
  }

  return getActiveItem(state)?.itemInputValue || null;
}
