import {
  AutocompleteState,
  AutocompleteStore,
  InternalAutocompleteOptions,
  Reducer,
  StateEnhancer,
} from './types';

export function createStore<TItem>(
  reducer: Reducer,
  props: InternalAutocompleteOptions<TItem>,
  stateEnhancers: Array<StateEnhancer<TItem>>
): AutocompleteStore<TItem> {
  function enhanceState(state: AutocompleteState<TItem>) {
    return stateEnhancers.reduce(
      (nextState, stateEnhancer) => stateEnhancer(nextState, props),
      state
    );
  }

  let state = enhanceState(props.initialState);

  return {
    getState() {
      return state;
    },
    send(action, payload) {
      const prevState = { ...state };
      state = enhanceState(
        reducer(state, {
          type: action,
          props,
          payload,
        })
      );

      props.onStateChange({ state, prevState });
    },
  };
}
