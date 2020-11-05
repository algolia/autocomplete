import { MaybePromise } from '@algolia/autocomplete-shared';

import { AutocompleteAccessibilityGetters } from './getters';
import { AutocompletePlugin } from './plugins';
import { AutocompleteSetters } from './setters';
import { AutocompleteState } from './state';

export interface AutocompleteApi<
  TItem,
  TEvent = Event,
  TMouseEvent = MouseEvent,
  TKeyboardEvent = KeyboardEvent
> extends AutocompleteSetters<TItem>,
    AutocompleteAccessibilityGetters<
      TItem,
      TEvent,
      TMouseEvent,
      TKeyboardEvent
    > {
  /**
   * Triggers a search to refresh the state.
   */
  refresh: AutocompleteRefresh;
}

export type AutocompleteRefresh = () => Promise<void>;

export interface AutocompleteCollection<TItem> {
  source: InternalAutocompleteSource<TItem>;
  items: TItem[];
}

export interface GetSourcesParams<TItem> extends AutocompleteSetters<TItem> {
  query: string;
  state: AutocompleteState<TItem>;
  refresh: AutocompleteRefresh;
}

interface ItemParams<TItem> {
  item: TItem;
  itemInputValue: ReturnType<
    InternalAutocompleteSource<TItem>['getItemInputValue']
  >;
  itemUrl: ReturnType<InternalAutocompleteSource<TItem>['getItemUrl']>;
  source: InternalAutocompleteSource<TItem>;
}

interface OnSelectParams<TItem>
  extends ItemParams<TItem>,
    AutocompleteSetters<TItem> {
  state: AutocompleteState<TItem>;
  event: any;
}

type OnHighlightParams<TItem> = OnSelectParams<TItem>;

interface OnSubmitParams<TItem> extends AutocompleteSetters<TItem> {
  state: AutocompleteState<TItem>;
  event: any;
}

interface OnInputParams<TItem> extends AutocompleteSetters<TItem> {
  query: string;
  state: AutocompleteState<TItem>;
  refresh: AutocompleteRefresh;
}

export interface AutocompleteSource<TItem> {
  // This allows flavors to pass other keys to their source.
  // Example: `templates` in the JavaScript API
  [key: string]: unknown;
  /**
   * Get the string value of the item. The value is used to fill the search box.
   */
  getItemInputValue?({
    item,
    state,
  }: {
    item: TItem;
    state: AutocompleteState<TItem>;
  }): string;
  /**
   * Get the URL of a item. The value is used to create default navigation features for
   * `onClick` and `onKeyDown`.
   */
  getItemUrl?({
    item,
    state,
  }: {
    item: TItem;
    state: AutocompleteState<TItem>;
  }): string | undefined;
  /**
   * Function called when the input changes. You can use this function to filter/search the items based on the query.
   */
  getItems(params: GetSourcesParams<TItem>): MaybePromise<TItem[] | TItem[][]>;
  /**
   * Function called when an item is selected.
   */
  onSelect?(params: OnSelectParams<TItem>): void;
  /**
   * Function called when an item is highlighted.
   *
   * An item is highlighted either via keyboard navigation or via mouse over.
   * You can trigger different behaviors based on the event `type`.
   */
  onHighlight?(params: OnHighlightParams<TItem>): void;
}

export type InternalAutocompleteSource<TItem> = {
  [KParam in keyof AutocompleteSource<TItem>]-?: AutocompleteSource<
    TItem
  >[KParam];
};

export type GetSources<TItem> = (
  params: GetSourcesParams<TItem>
) => Promise<Array<InternalAutocompleteSource<TItem>>>;

export type Environment =
  | Window
  | {
      [prop: string]: unknown;
      addEventListener: Window['addEventListener'];
      removeEventListener: Window['removeEventListener'];
      setTimeout: Window['setTimeout'];
      document: Window['document'];
      location: {
        assign: Location['assign'];
      };
      open: Window['open'];
    };

interface Navigator<TItem> {
  /**
   * Called when a URL should be open in the current page.
   */
  navigate(params: {
    itemUrl: string;
    item: TItem;
    state: AutocompleteState<TItem>;
  }): void;
  /**
   * Called when a URL should be open in a new tab.
   */
  navigateNewTab(params: {
    itemUrl: string;
    item: TItem;
    state: AutocompleteState<TItem>;
  }): void;
  /**
   * Called when a URL should be open in a new window.
   */
  navigateNewWindow(params: {
    itemUrl: string;
    item: TItem;
    state: AutocompleteState<TItem>;
  }): void;
}

export interface AutocompleteOptions<TItem> {
  /**
   * Whether to consider the experience in debug mode.
   *
   * The debug mode is useful when developing because it doesn't close
   * the dropdown when the blur event occurs.
   *
   * @default false
   */
  debug?: boolean;
  /**
   * The Autocomplete ID to create accessible attributes.
   *
   * @default "autocomplete-0"
   */
  id?: string;
  /**
   * Function called when the internal state changes.
   */
  onStateChange?<TItem>(props: {
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
   * Whether to open the dropdown on focus when there's no query.
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
  getSources(
    params: GetSourcesParams<TItem>
  ): MaybePromise<Array<AutocompleteSource<TItem>>>;
  /**
   * The environment from where your JavaScript is running.
   * Useful if you're using autocomplete in a different context than
   * `window`.
   *
   * @default window
   */
  environment?: Environment;
  /**
   * Navigator API to redirect the user when a link should be opened.
   */
  navigator?: Partial<Navigator<TItem>>;
  /**
   * The function called to determine whether the dropdown should open.
   */
  shouldDropdownShow?(params: { state: AutocompleteState<TItem> }): boolean;
  /**
   * The function called when the autocomplete form is submitted.
   */
  onSubmit?(params: OnSubmitParams<TItem>): void;
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
export interface InternalAutocompleteOptions<TItem>
  extends AutocompleteOptions<TItem> {
  debug: boolean;
  id: string;
  onStateChange<TItem>(props: {
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
  environment: Environment;
  navigator: Navigator<TItem>;
  plugins: Array<AutocompletePlugin<TItem, unknown>>;
  shouldDropdownShow(params: { state: AutocompleteState<TItem> }): boolean;
  onSubmit(params: OnSubmitParams<TItem>): void;
  onInput?(params: OnInputParams<TItem>): void | Promise<any>;
}
