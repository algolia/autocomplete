import { stateReducer } from './stateReducer';

import { AutocompleteOptions, AutocompleteStore } from './types';

export function createStore<TItem>(
  props: AutocompleteOptions<TItem>
): AutocompleteStore<TItem> {
  return {
    state: props.initialState,
    getState() {
      return this.state;
    },
    send(action, payload) {
      this.state = stateReducer(
        { type: action, value: payload },
        this.state,
        props
      );

      props.onStateChange({ state: this.state });
    },
  };
}
