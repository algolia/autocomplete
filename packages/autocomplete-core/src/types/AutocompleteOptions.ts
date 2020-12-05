import { MaybePromise } from '@algolia/autocomplete-shared';

import { AutocompleteScopeApi, BaseItem } from './AutocompleteApi';
import { AutocompleteEnvironment } from './AutocompleteEnvironment';
import { AutocompleteNavigator } from './AutocompleteNavigator';
import { AutocompletePlugin } from './AutocompletePlugin';
import {
  AutocompleteSource,
  InternalAutocompleteSource,
} from './AutocompleteSource';
import { AutocompleteState } from './AutocompleteState';

interface OnSubmitParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  state: AutocompleteState<TItem>;
  event: any;
}

type OnResetParams<TItem extends BaseItem> = OnSubmitParams<TItem>;

interface OnInputParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  query: string;
  state: AutocompleteState<TItem>;
}

export type GetSourcesParams<TItem extends BaseItem> = OnInputParams<TItem>;

export type GetSources<TItem extends BaseItem> = (
  params: GetSourcesParams<TItem>
) => Promise<Array<InternalAutocompleteSource<TItem>>>;

export interface AutocompleteOptions<TItem extends BaseItem> {
  /**
   * Whether to consider the experience in debug mode.
   *
   * The debug mode is useful when developing because it doesn't close
   * the panel when the blur event occurs.
   *
   * @default false
   */
  debug?: boolean;
  /**
   * The unique Autocomplete ID to create accessible attributes.
   *
   * It is incremented by default when creating a new Autocomplete instance.
   *
   * @default "autocomplete-0"
   */
  id?: string;
  /**
   * Function called when the internal state changes.
   */
  onStateChange?(props: {
    state: AutocompleteState<TItem>;
    prevState: AutocompleteState<TItem>;
  }): void;
  /**
   * The text that appears in the search box input when there is no query.
   */
  placeholder?: string;
  /**
   * Whether to focus the search box when the page is loaded.
   *
   * @default false
   */
  autoFocus?: boolean;
  /**
   * The default item index to pre-select.
   *
   * @default null
   */
  defaultSelectedItemId?: number | null;
  /**
   * Whether to open the panel on focus when there's no query.
   *
   * @default false
   */
  openOnFocus?: boolean;
  /**
   * The number of milliseconds that must elapse before the autocomplete
   * experience is stalled.
   *
   * @default 300
   */
  stallThreshold?: number;
  /**
   * The initial state to apply when autocomplete is created.
   */
  initialState?: Partial<AutocompleteState<TItem>>;
  /**
   * The sources to get the suggestions from.
   */
  getSources?(
    params: GetSourcesParams<TItem>
  ): MaybePromise<Array<AutocompleteSource<TItem>>>;
  /**
   * The environment from where your JavaScript is running.
   * Useful if you're using autocomplete in a different context than
   * `window`.
   *
   * @default window
   */
  environment?: AutocompleteEnvironment;
  /**
   * Navigator API to redirect the user when a link should be opened.
   */
  navigator?: Partial<AutocompleteNavigator<TItem>>;
  /**
   * The function called to determine whether the panel should open.
   */
  shouldPanelShow?(params: { state: AutocompleteState<TItem> }): boolean;
  /**
   * The function called when the Autocomplete form is submitted.
   */
  onSubmit?(params: OnSubmitParams<TItem>): void;
  /**
   * The function called when the Autocomplete form is reset.
   */
  onReset?(params: OnResetParams<TItem>): void;
  /**
   * The function called when the input changes.
   *
   * This turns the experience in controlled mode, leaving you in charge of
   * updating the state.
   */
  onInput?(params: OnInputParams<TItem>): void;
  /**
   * The array of plugins.
   */
  plugins?: Array<AutocompletePlugin<TItem, unknown>>;
}

// Props manipulated internally with default values.
export interface InternalAutocompleteOptions<TItem extends BaseItem>
  extends AutocompleteOptions<TItem> {
  debug: boolean;
  id: string;
  onStateChange(props: {
    state: AutocompleteState<TItem>;
    prevState: AutocompleteState<TItem>;
  }): void;
  placeholder: string;
  autoFocus: boolean;
  defaultSelectedItemId: number | null;
  openOnFocus: boolean;
  stallThreshold: number;
  initialState: AutocompleteState<TItem>;
  getSources: GetSources<TItem>;
  environment: AutocompleteEnvironment;
  navigator: AutocompleteNavigator<TItem>;
  plugins: Array<AutocompletePlugin<TItem, unknown>>;
  shouldPanelShow(params: { state: AutocompleteState<TItem> }): boolean;
  onSubmit(params: OnSubmitParams<TItem>): void;
  onReset(params: OnResetParams<TItem>): void;
  onInput?(params: OnInputParams<TItem>): void | Promise<any>;
}
