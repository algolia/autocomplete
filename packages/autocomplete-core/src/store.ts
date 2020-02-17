import { AutocompleteState, AutocompleteStore } from './types';

type Listener<TItem> = (params: { state: AutocompleteState<TItem> }) => void;

export function createStore<TItem>(
  initialState: AutocompleteState<TItem>,
  listener: Listener<TItem>
): AutocompleteStore<TItem> {
  return {
    state: initialState,
    getState() {
      return this.state;
    },
    setState(nextState) {
      this.state = nextState;

      listener({ state: this.state });
    },
  };
}
