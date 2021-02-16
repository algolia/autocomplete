import {
  AutocompletePlugin as AutocompleteCorePlugin,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteOptions } from './AutocompleteOptions';

export type AutocompletePlugin<TItem extends BaseItem, TData> = Omit<
  AutocompleteCorePlugin<TItem, TData>,
  'getSources'
> & {
  getSources: AutocompleteOptions<TItem>['getSources'];
};
