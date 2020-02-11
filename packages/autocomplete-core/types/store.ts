import { AutocompleteState } from './state';

export interface AutocompleteStore<TItem> {
  state: AutocompleteState<TItem>;
  getState(): AutocompleteState<TItem>;
  setState(nextState: AutocompleteState<TItem>): void;
}
