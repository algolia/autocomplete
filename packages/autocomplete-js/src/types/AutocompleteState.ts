import {
  AutocompleteState as AutocompleteCoreState,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteCollection } from './AutocompleteCollection';

export type AutocompleteState<TItem extends BaseItem> = Omit<
  AutocompleteCoreState<TItem>,
  'collections'
> & {
  collections: Array<AutocompleteCollection<TItem>>;
};
