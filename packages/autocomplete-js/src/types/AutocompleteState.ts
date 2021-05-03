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
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/state/#param-collections
   */
  collections: Array<AutocompleteCollection<TItem>>;
};
