import { AutocompleteState } from './state';

export type StateUpdater<TState> = (value: TState) => void;

export interface AutocompleteSetters<TItem> {
  setSelectedItemId: StateUpdater<AutocompleteState<TItem>['highlightedIndex']>;
  setQuery: StateUpdater<AutocompleteState<TItem>['query']>;
  setCollections: StateUpdater<AutocompleteState<TItem>['suggestions']>;
  setIsOpen: StateUpdater<AutocompleteState<TItem>['isOpen']>;
  setStatus: StateUpdater<AutocompleteState<TItem>['status']>;
  setContext: StateUpdater<AutocompleteState<TItem>['context']>;
}
