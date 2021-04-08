import {
  AutocompletePlugin as AutocompleteCorePlugin,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteOptions } from './AutocompleteOptions';

export type AutocompletePlugin<TItem extends BaseItem, TData> = Omit<
  AutocompleteCorePlugin<TItem, TData>,
  'getSources'
> & {
  /**
   * The function called when the internal state changes.
   *
   * @link https://autocomplete.algolia.com/docs/plugins#onstatechange
   */
  getSources: AutocompleteOptions<TItem>['getSources'];
};
