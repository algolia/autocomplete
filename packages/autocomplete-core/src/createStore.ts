import {
  InternalAutocompleteOptions,
  AutocompleteStore,
  Reducer,
  StateEnhancer,
} from './types';

export function createStore<TItem>(
  reducer: Reducer,
  props: InternalAutocompleteOptions<TItem>,
  stateEnhancers: Array<StateEnhancer<TItem>>
): AutocompleteStore<TItem> {
  let state = props.initialState;

  return {
    getState() {
      return state;
    },
    send(action, payload) {
      state = stateEnhancers.reduce(
        (nextState, stateEnhancer) => stateEnhancer(nextState, props),
        reducer(state, {
          type: action,
          props,
          payload,
        })
      );

      props.onStateChange({ state });
    },
  };
}
