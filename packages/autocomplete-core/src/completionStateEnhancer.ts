import { getCompletion } from './getCompletion';
import { AutocompleteState, InternalAutocompleteOptions } from './types';

export function completionStateEnhancer<TItem>(
  state: AutocompleteState<TItem>,
  props: InternalAutocompleteOptions<TItem>
) {
  return {
    ...state,
    completion: getCompletion({ state, props }),
  };
}
