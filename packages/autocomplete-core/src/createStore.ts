import { getCompletion } from './getCompletion';
import {
  InternalAutocompleteOptions,
  AutocompleteState,
  AutocompleteStore,
  Reducer,
} from './types';

export function createStore<TItem>(
  reducer: Reducer,
  props: InternalAutocompleteOptions<TItem>
): AutocompleteStore<TItem> {
  let state = props.initialState;

  return {
    getState() {
      return state;
    },
    send(action, payload) {
      state = withCompletion(
        reducer(state, {
          type: action,
          props,
          payload,
        }),
        props
      );

      props.onStateChange({ state });
    },
  };
}

function withCompletion<TItem>(
  state: AutocompleteState<TItem>,
  props: InternalAutocompleteOptions<TItem>
) {
  return {
    ...state,
    completion: getCompletion({ state, props }),
  };
}
