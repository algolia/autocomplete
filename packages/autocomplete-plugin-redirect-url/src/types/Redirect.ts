import {
  AutocompleteState,
  BaseItem,
  InternalAutocompleteOptions,
} from '@algolia/autocomplete-core';
import { SourceTemplates } from '@algolia/autocomplete-js';
import {
  SearchForFacetValuesResponse,
  TransformedRequesterResponse,
} from '@algolia/autocomplete-preset-algolia';
import type { SearchResponse } from '@algolia/autocomplete-shared';

export interface RedirectUrlPlugin {
  data: RedirectUrlState[];
}

export interface RedirectUrlState {
  sourceId: string;
  urls: string[];
}

export interface RedirectUrlItem extends RedirectUrlState, BaseItem {}

export type OnRedirectOptions<TItem extends RedirectUrlItem> = {
  event: any;
  navigator: InternalAutocompleteOptions<TItem>['navigator'];
  state: AutocompleteState<TItem>;
};

export interface TransformResponse {
  url: string | undefined;
  query: string | undefined;
}

export type Response<TItem> =
  | SearchResponse<TItem>
  | SearchForFacetValuesResponse;

export type CreateRedirectUrlPluginParams<TItem extends BaseItem> = {
  /**
   * Map the response to values that can be interpreted by the plugin to correctly parse redirects.
   *
   * Supports Algolia results out of the box.
   */
  transformResponse?(
    response: Response<TItem>
  ): TransformResponse | string | undefined;
  /**
   * Handles the navigation logic once a redirect is triggered
   *
   * Supports Algolia results out of the box.
   */
  onRedirect?(
    redirects: RedirectUrlItem[],
    options: OnRedirectOptions<RedirectUrlItem>
  ): void;
  /**
   * The template used to render injected redirect dropdown items.
   */
  templates?: SourceTemplates<RedirectUrlItem>;
  /**
   * Waits for all pending requests to complete before handling a form submission .
   * (ex: pressing the "enter" key in the input)
   *
   * A boolean return value will wait for all pending requests to resolve.
   * A number value will achieve the above with a timeout (in ms) to exit if it takes too long.
   */
  awaitSubmit?: () => boolean | number;
};
