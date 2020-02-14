import { AutocompleteAccessibilityGetters } from './propGetters';
import { AutocompleteSetters } from './setters';
import { AutocompleteState } from './state';
import { EventHandlerParams, ItemEventHandlerParams } from './events';

export interface AutocompleteApi<TItem>
  extends AutocompleteSetters<TItem>,
    AutocompleteAccessibilityGetters<TItem> {
  getCompletion(): string | null;
}

export interface AutocompleteSuggestion<TItem> {
  source: AutocompleteSource<TItem>;
  items: TItem[];
}

export interface GetSourcesOptions<TItem> extends AutocompleteSetters<TItem> {
  query: string;
  state: AutocompleteState<TItem>;
}

export interface PublicAutocompleteSource<TItem> {
  /**
   * Get the string value of the suggestion. The value is used to fill the search box.
   */
  getInputValue?({
    suggestion,
    state,
  }: {
    suggestion: TItem;
    state: AutocompleteState<TItem>;
  }): string;
  /**
   * Get the URL of a suggestion. The value is used to create default navigation features for
   * `onClick` and `onKeyDown`.
   */
  getSuggestionUrl?({
    suggestion,
    state,
  }: {
    suggestion: TItem;
    state: AutocompleteState<TItem>;
  }): string | undefined;
  /**
   * Function called when the input changes. You can use this function to filter/search the items based on the query.
   */
  getSuggestions(
    options: GetSourcesOptions<TItem>
  ):
    | Array<AutocompleteSuggestion<TItem>>
    | Promise<Array<AutocompleteSuggestion<TItem>>>;
  /**
   * Called when an item is selected.
   */
  onSelect?: (options: ItemEventHandlerParams<TItem>) => void;
}

export type AutocompleteSource<TItem> = {
  [KParam in keyof PublicAutocompleteSource<TItem>]-?: PublicAutocompleteSource<
    TItem
  >[KParam];
};

export type GetSources<TItem> = (
  options: GetSourcesOptions<TItem>
) => Promise<Array<AutocompleteSource<TItem>>>;

export interface Environment {
  [prop: string]: unknown;
  addEventListener: Window['addEventListener'];
  removeEventListener: Window['removeEventListener'];
  setTimeout: Window['setTimeout'];
  document: Window['document'];
  location: {
    assign: Location['assign'];
  };
  open: Window['open'];
}

interface Navigator<TItem> {
  /**
   * Called when a URL should be open in the current page.
   */
  navigate(params: {
    suggestionUrl: string;
    suggestion: TItem;
    state: AutocompleteState<TItem>;
  }): void;
  /**
   * Called when a URL should be open in a new tab.
   */
  navigateNewTab(params: {
    suggestionUrl: string;
    suggestion: TItem;
    state: AutocompleteState<TItem>;
  }): void;
  /**
   * Called when a URL should be open in a new window.
   */
  navigateNewWindow(params: {
    suggestionUrl: string;
    suggestion: TItem;
    state: AutocompleteState<TItem>;
  }): void;
}

export interface PublicAutocompleteOptions<TItem> {
  /**
   * The Autocomplete ID to create accessible attributes.
   *
   * @default "autocomplete-0"
   */
  id?: string;
  /**
   * Function called when the internal state changes.
   */
  onStateChange?<TItem>(props: { state: AutocompleteState<TItem> }): void;
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
   * @default 0
   */
  defaultHighlightedIndex?: number;
  /**
   * The function called when an item is selected.
   */
  // onSelect(): void;
  /**
   * Whether to show the highlighted suggestion as completion in the input.
   *
   * @default false
   */
  showCompletion?: boolean;
  /**
   * The minimum number of characters long the autocomplete opens.
   *
   * @default 1
   */
  minLength?: number;
  /**
   * The number of milliseconds that must elapse before the autocomplete
   * experience is stalled.
   *
   * @default 300
   */
  stallThreshold?: number;
  /**
   * The initial state to apply when the page is loaded.
   */
  initialState?: Partial<AutocompleteState<TItem>>;
  /**
   * The sources to get the suggestions from.
   */
  getSources(
    options: GetSourcesOptions<TItem>
  ):
    | Array<PublicAutocompleteSource<TItem>>
    | Promise<Array<PublicAutocompleteSource<TItem>>>;
  /**
   * The environment from where your JavaScript is running.
   * Useful if you're using Autocomplete.js in a different context than
   * `window`.
   *
   * @default window
   */
  environment?: Environment;
  /**
   * Navigator's API to redirect the user when a link should be open.
   */
  navigator?: Navigator<TItem>;
  /**
   * The function called to determine whether the dropdown should open.
   */
  shouldDropdownOpen?(options: { state: AutocompleteState<TItem> }): boolean;
  /**
   * The function called when the autocomplete form is submitted.
   */
  onSubmit?(params: EventHandlerParams<TItem>): void;
}

// Props manipulated internally with default values.
export interface AutocompleteOptions<TItem> {
  id: string;
  onStateChange<TItem>(props: { state: AutocompleteState<TItem> }): void;
  placeholder: string;
  autoFocus: boolean;
  defaultHighlightedIndex: number;
  showCompletion: boolean;
  minLength: number;
  stallThreshold: number;
  initialState: AutocompleteState<TItem>;
  getSources: GetSources<TItem>;
  environment: Environment;
  navigator: Navigator<TItem>;
  shouldDropdownOpen(options: { state: AutocompleteState<TItem> }): boolean;
  onSubmit(params: EventHandlerParams<TItem>): void;
}
