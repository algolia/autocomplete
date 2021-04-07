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

export interface OnSubmitParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  state: AutocompleteState<TItem>;
  event: any;
}

export type OnResetParams<TItem extends BaseItem> = OnSubmitParams<TItem>;

export interface OnInputParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  query: string;
  state: AutocompleteState<TItem>;
}

export type GetSourcesParams<TItem extends BaseItem> = OnInputParams<TItem>;

export type GetSources<TItem extends BaseItem> = (
  params: GetSourcesParams<TItem>
) => MaybePromise<Array<AutocompleteSource<TItem> | boolean | undefined>>;
export type InternalGetSources<TItem extends BaseItem> = (
  params: GetSourcesParams<TItem>
) => Promise<Array<InternalAutocompleteSource<TItem>>>;

interface OnStateChangeProps<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  /**
   * The current Autocomplete state.
   */
  state: AutocompleteState<TItem>;
  /**
   * The previous Autocomplete state.
   */
  prevState: AutocompleteState<TItem>;
}

export interface AutocompleteOptions<TItem extends BaseItem> {
  /**
   * A flag to activate the debug mode.
   *
   * This is useful while developing because it keeps the panel open even when the blur event occurs. **Make sure to disable it in production.**
   *
   * See [**Debugging**](https://autocomplete.algolia.com/docs/debugging) for more information.
   *
   * @default false
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#debug
   */
  debug?: boolean;
  /**
   * An ID for the autocomplete to create accessible attributes.
   *
   * It is incremented by default when creating a new Autocomplete instance.
   *
   * @default "autocomplete-0"
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#id
   */
  id?: string;
  /**
   * The function called when the internal state changes.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#onstatechange
   */
  onStateChange?(props: OnStateChangeProps<TItem>): void;
  /**
   * The placeholder text to show in the search input when there's no query.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#placeholder
   */
  placeholder?: string;
  /**
   * Whether to focus the search input or not when the page is loaded.
   *
   * @default false
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#autofocus
   */
  autoFocus?: boolean;
  /**
   * The default item index to pre-select.
   *
   * We recommend using `0` when the query typed aims at opening item links, without triggering an actual search.
   *
   * @default null
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#defaultactiveitemid
   */
  defaultActiveItemId?: number | null;
  /**
   * Whether to open the panel on focus or not when there's no query.
   *
   * @default false
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#openonfocus
   */
  openOnFocus?: boolean;
  /**
   * How many milliseconds must elapse before considering the autocomplete experience [stalled](https://autocomplete.algolia.com/docs/state#status).
   *
   * @default 300
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#stallthreshold
   */
  stallThreshold?: number;
  /**
   * The initial state to apply when autocomplete is created.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#initialstate
   */
  initialState?: Partial<AutocompleteState<TItem>>;
  /**
   * The [sources](https://autocomplete.algolia.com/docs/sources) to get the suggestions from.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#getsources
   */
  getSources?: GetSources<TItem>;
  /**
   * The environment in which your application is running.
   *
   * This is useful if you're using autocomplete in a different context than `window`.
   *
   * @default window
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#environment
   */
  environment?: AutocompleteEnvironment;
  /**
   * An implementation of Autocomplete's Navigator API to redirect the user when opening a link.
   *
   * Learn more on the [**Navigator API**](https://autocomplete.algolia.com/docs/keyboard-navigation) documentation.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#navigator
   */
  navigator?: Partial<AutocompleteNavigator<TItem>>;
  /**
   * The function called to determine whether the panel should open or not.
   *
   * By default, the panel opens when there are items in the state.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#shouldpanelopen
   */
  shouldPanelOpen?(params: { state: AutocompleteState<TItem> }): boolean;
  /**
   * The function called when submitting the Autocomplete form.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#onsubmit
   */
  onSubmit?(params: OnSubmitParams<TItem>): void;
  /**
   * The function called when resetting the Autocomplete form.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#onreset
   */
  onReset?(params: OnResetParams<TItem>): void;
  /**
   * The plugins that encapsulate and distribute custom Autocomplete behaviors.
   *
   * See [**Plugins**](https://autocomplete.algolia.com/docs/plugins) for more information.
   *
   * @link https://autocomplete.algolia.com/docs/autocomplete-js#plugins
   */
  plugins?: Array<AutocompletePlugin<TItem, unknown>>;
}

// Props manipulated internally with default values.
export interface InternalAutocompleteOptions<TItem extends BaseItem>
  extends AutocompleteOptions<TItem> {
  debug: boolean;
  id: string;
  onStateChange(props: OnStateChangeProps<TItem>): void;
  placeholder: string;
  autoFocus: boolean;
  defaultActiveItemId: number | null;
  openOnFocus: boolean;
  stallThreshold: number;
  initialState: AutocompleteState<TItem>;
  getSources: InternalGetSources<TItem>;
  environment: AutocompleteEnvironment;
  navigator: AutocompleteNavigator<TItem>;
  plugins: Array<AutocompletePlugin<TItem, unknown>>;
  shouldPanelOpen(params: { state: AutocompleteState<TItem> }): boolean;
  onSubmit(params: OnSubmitParams<TItem>): void;
  onReset(params: OnResetParams<TItem>): void;
}
