import { getCompletion } from './getCompletion';
import {
  AutocompleteOptions,
  AutocompleteState,
  AutocompleteStore,
  Reducer,
} from './types';

export function createStore<TItem>(
  reducer: Reducer,
  props: AutocompleteOptions<TItem>
): AutocompleteStore<TItem> {
  return {
    state: props.initialState,
    getState() {
      return this.state;
    },
    send(action, payload) {
      this.state = withCompletion(
        reducer({ type: action, value: payload }, this.state, props),
        props
      );

      props.onStateChange({ state: this.state });
    },
  };
}

function withCompletion<TItem>(
  state: AutocompleteState<TItem>,
  props: AutocompleteOptions<TItem>
) {
  return {
    ...state,
    completion: getCompletion({ state, props }),
  };
}
