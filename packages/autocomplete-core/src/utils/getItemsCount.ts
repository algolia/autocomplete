import { AutocompleteState } from '../types';

export function getItemsCount(state: AutocompleteState<any>) {
  if (state.collections.length === 0) {
    return 0;
  }

  return state.collections.reduce<number>(
    (sum, collection) => sum + collection.items.length,
    0
  );
}
