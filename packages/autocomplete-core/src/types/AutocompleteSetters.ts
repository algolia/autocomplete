import { BaseItem } from './AutocompleteApi';
import {
  AutocompleteCollection,
  AutocompleteCollectionItemsArray,
} from './AutocompleteCollection';
import { AutocompleteState } from './AutocompleteState';

export type StateUpdater<TState> = (value: TState) => void;

export interface AutocompleteSetters<TItem extends BaseItem> {
  /**
   * Sets the highlighted item index.
   *
   * Pass `null` to unselect items.
   *
   * @link https://autocomplete.algolia.com/docs/state#setactiveitemid
   */
  setActiveItemId: StateUpdater<AutocompleteState<TItem>['activeItemId']>;
  /**
   * Sets the query.
   *
   * @link https://autocomplete.algolia.com/docs/state#setquery
   */
  setQuery: StateUpdater<AutocompleteState<TItem>['query']>;
  /**
   * Sets the collections.
   *
   * @link https://autocomplete.algolia.com/docs/state#setcollections
   */
  setCollections: StateUpdater<
    Array<
      AutocompleteCollection<TItem> | AutocompleteCollectionItemsArray<TItem>
    >
  >;
  /**
   * Sets whether the panel is open or not.
   *
   * @link https://autocomplete.algolia.com/docs/state#setisopen
   */
  setIsOpen: StateUpdater<AutocompleteState<TItem>['isOpen']>;
  /**
   * Sets the status of the autocomplete.
   *
   * @link https://autocomplete.algolia.com/docs/state#setisopen
   */
  setStatus: StateUpdater<AutocompleteState<TItem>['status']>;
  /**
   * Sets the context passed to lifecycle hooks.
   *
   * See more in [**Context**](https://autocomplete.algolia.com/docs/context).
   *
   * @link https://autocomplete.algolia.com/docs/state#setcontext
   */
  setContext: StateUpdater<AutocompleteState<TItem>['context']>;
}
