export * from '@algolia/autocomplete-shared/dist/esm/core';
export * from './AutocompleteStore';
export * from './AutocompleteSubscribers';

import { CreateAlgoliaInsightsPluginParams } from '@algolia/autocomplete-plugin-algolia-insights';
import {
  AutocompleteOptions as _AutocompleteOptions,
  BaseItem,
} from '@algolia/autocomplete-shared/dist/esm/core';

export interface AutocompleteOptions<TItem extends BaseItem>
  extends _AutocompleteOptions<TItem> {
  /**
   * Whether to enable the Insights plugin and load the Insights library if it has not been loaded yet.
   *
   * See [**autocomplete-plugin-algolia-insights**](https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-plugin-algolia-insights/) for more information.
   *
   * @default false
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/api-reference/autocomplete-js/autocomplete/#param-insights
   */
  insights?: CreateAlgoliaInsightsPluginParams | boolean;
}
