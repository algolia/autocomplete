export * from '@algolia/autocomplete-shared/dist/esm/js';
export * from './AutocompleteApi';
export * from './AutocompleteDom';

import {
  AutocompleteOptions as AutocompleteCoreOptions,
  BaseItem,
} from '@algolia/autocomplete-core';
import { AutocompleteOptions as AutocompleteJsOptions } from '@algolia/autocomplete-shared/dist/esm/js';

export interface AutocompleteOptions<TItem extends BaseItem>
  extends AutocompleteJsOptions<TItem> {
  insights?: AutocompleteCoreOptions<TItem>['insights'];
}
