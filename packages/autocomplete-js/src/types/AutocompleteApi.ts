import {
  AutocompleteScopeApi as AutocompleteCoreScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteOptions } from './';

export interface AutocompleteApi<TItem extends BaseItem>
  extends AutocompleteCoreScopeApi<TItem> {
  /**
   * Updates the Autocomplete experience.
   */
  update(updatedOptions: Partial<AutocompleteOptions<TItem>>): void;
  /**
   * Cleans up the DOM mutations and event listeners.
   */
  destroy(): void;
}
