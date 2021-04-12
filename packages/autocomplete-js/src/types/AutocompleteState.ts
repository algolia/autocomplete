import {
  AutocompleteState as AutocompleteCoreState,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteCollection } from './AutocompleteCollection';

export type AutocompleteState<TItem extends BaseItem> = Omit<
  AutocompleteCoreState<TItem>,
  'collections'
> & {
  /**
   * The collections of items.
   *
   * @link https://autocomplete.algolia.com/docs/state/#collections
   */
  collections: Array<AutocompleteCollection<TItem>>;
};
