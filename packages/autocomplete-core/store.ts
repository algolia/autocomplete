import { AutocompleteState, AutocompleteStore } from './types';

export function createStore<TItem>(
  initialState: AutocompleteState<TItem>
): AutocompleteStore<TItem> {
  return {
    state: initialState,
    getState() {
      return this.state;
    },
    setState(nextState) {
      this.state = nextState;
    },
  };
}
