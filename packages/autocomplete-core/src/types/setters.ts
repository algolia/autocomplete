import { AutocompleteState } from './state';

export type StateUpdater<TState> = (value: TState) => void;

export interface AutocompleteSetters<TItem> {
  setSelectedItemId: StateUpdater<AutocompleteState<TItem>['selectedItemId']>;
  setQuery: StateUpdater<AutocompleteState<TItem>['query']>;
  setCollections: StateUpdater<AutocompleteState<TItem>['collections']>;
  setIsOpen: StateUpdater<AutocompleteState<TItem>['isOpen']>;
  setStatus: StateUpdater<AutocompleteState<TItem>['status']>;
  setContext: StateUpdater<AutocompleteState<TItem>['context']>;
}
