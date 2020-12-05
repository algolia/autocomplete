import {
  AutocompleteScopeApi as AutocompleteCoreScopeApi,
  BaseItem,
} from '@algolia/autocomplete-core';

export interface AutocompleteApi<TItem extends BaseItem>
  extends AutocompleteCoreScopeApi<TItem> {
  /**
   * Cleans up the DOM mutations and event listeners.
   */
  destroy(): void;
}
