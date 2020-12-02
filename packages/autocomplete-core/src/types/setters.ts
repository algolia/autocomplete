import {
  AutocompleteCollection,
  AutocompleteCollectionItemsArray,
  BaseItem,
} from './api';
import { AutocompleteState } from './state';

export type StateUpdater<TState> = (value: TState) => void;

export interface AutocompleteSetters<TItem extends BaseItem> {
  setSelectedItemId: StateUpdater<AutocompleteState<TItem>['selectedItemId']>;
  setQuery: StateUpdater<AutocompleteState<TItem>['query']>;
  setCollections: StateUpdater<
    Array<
      AutocompleteCollection<TItem> | AutocompleteCollectionItemsArray<TItem>
    >
  >;
  setIsOpen: StateUpdater<AutocompleteState<TItem>['isOpen']>;
  setStatus: StateUpdater<AutocompleteState<TItem>['status']>;
  setContext: StateUpdater<AutocompleteState<TItem>['context']>;
}
