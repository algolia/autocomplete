import {
  AutocompleteState,
  BaseItem,
  InternalAutocompleteOptions,
} from '@algolia/autocomplete-core';
import { SourceTemplates } from '@algolia/autocomplete-js';
import { SearchForFacetValuesResponse } from '@algolia/autocomplete-preset-algolia';
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

export type Response<TItem> =
  | SearchResponse<TItem>
  | SearchForFacetValuesResponse;

export type CreateRedirectUrlPluginParams<TItem extends BaseItem> = {
  /**
   * Maps the response to the redirect url that will be used by the plugin.
   *
   * Already supports Algolia results by default.
   */
  transformResponse?(response: Response<TItem>): string | undefined;
  /**
   * Maps the query used in the request to match with the redirect.
   * Without this mapping, there is a risk of the race condition when processing
   * redirect items where the last-resolved response can reflect an earlier query value.
   * (ex: typing "shoes" quickly risks mismatching the redirect item with "sho" instead)
   *
   * Already supports Algolia results by default.
   */
  transformResponseToQuery?(response: Response<TItem>): string | undefined;
  /**
   * Handles the navigation logic once a redirect is triggered.
   *
   * Already supports Algolia results by default.
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
   * Waits for all pending requests to complete before handling a form submission.
   * (ex: pressing the "enter" key in the input)
   *
   * A boolean return value will wait for all pending requests to resolve.
   * A number value will achieve the above with a timeout (in ms) to exit if it takes too long.
   */
  awaitSubmit?: () => boolean | number;
};
