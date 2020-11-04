import {
  AutocompleteStore,
  InternalAutocompleteOptions,
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
      const prevState = { ...state };
      state = reducer(state, {
        type: action,
        props,
        payload,
      });

      props.onStateChange({ state, prevState });
    },
  };
}
