export type StateUpdater<TState> = (value: TState) => void;

export interface AutocompleteItem {
  __autocomplete_id: number;
}

type SuggestionsOptions = any;

export type AutocompleteSource = any;

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

export interface AutocompleteStore<TItem> {
  state: AutocompleteState<TItem>;
  getState(): AutocompleteState<TItem>;
  setState(nextState: AutocompleteState<TItem>): void;
}

export type GetRootProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-expanded': boolean;
  'aria-haspopup': string;
  'aria-owns': string | null;
  'aria-labelledby': string;
};

export type GetFormProps = (props: {
  [key: string]: unknown;
  inputElement: HTMLInputElement | null;
}) => {
  onSubmit(event: Event): void;
  onReset(event: Event): void;
};

export type GetInputProps = (props?: {
  [key: string]: unknown;
  inputElement: HTMLInputElement;
}) => {
  id: string;
  value: string;
  autofocus: boolean;
  placeholder: string;
  autoComplete: 'on' | 'off';
  autoCorrect: 'off';
  autoCapitalize: 'off';
  spellCheck: boolean;
  'aria-autocomplete': 'list';
  'aria-activedescendant': string | null;
  'aria-controls': string | null;
  'aria-labelledby': string;
  onInput(event: Event): void;
  onKeyDown(event: KeyboardEvent): void;
  onFocus(): void;
  onBlur(): void;
  onClick(event: MouseEvent): void;
};

export type GetItemProps<TItem> = (props: {
  [key: string]: unknown;
  item: TItem;
  source: AutocompleteSource;
}) => {
  id: string;
  role: string;
  'aria-selected': boolean;
  onMouseMove(event: MouseEvent): void;
  onMouseDown(event: MouseEvent): void;
  onClick(event: MouseEvent): void;
};

export type GetLabelProps = (props?: {
  [key: string]: unknown;
}) => {
  htmlFor: string;
  id: string;
};

export type GetMenuProps = (props?: {
  [key: string]: unknown;
}) => {
  role: string;
  'aria-labelledby': string;
  id: string;
};

export interface AutocompleteSetters<TItem> {
  setHighlightedIndex: StateUpdater<
    AutocompleteState<TItem>['highlightedIndex']
  >;
  setQuery: StateUpdater<AutocompleteState<TItem>['query']>;
  setSuggestions: StateUpdater<AutocompleteState<TItem>['suggestions']>;
  setIsOpen: StateUpdater<AutocompleteState<TItem>['isOpen']>;
  setStatus: StateUpdater<AutocompleteState<TItem>['status']>;
  setContext: StateUpdater<AutocompleteState<TItem>['context']>;
}

export interface Suggestion<TItem> {
  items: TItem[];
  source: AutocompleteSource;
}

export interface AutocompleteAccessibilityGetters<TItem> {
  getRootProps: GetRootProps;
  getFormProps: GetFormProps;
  getInputProps: GetInputProps;
  getItemProps: GetItemProps<TItem>;
  getLabelProps: GetLabelProps;
  getMenuProps: GetMenuProps;
}

type AutocompleteStatus = 'idle' | 'loading' | 'stalled' | 'error';

export interface AutocompleteState<TItem> {
  highlightedIndex: number;
  query: string;
  suggestions: Array<Suggestion<TItem>>;
  isOpen: boolean;
  status: AutocompleteStatus;
  statusContext: {
    error?: Error;
  };
  context: { [key: string]: unknown };
}

export interface AutocompleteInstance<TItem>
  extends AutocompleteSetters<TItem>,
    AutocompleteAccessibilityGetters<TItem> {
  getCompletion(): string | null;
}

export interface AutocompleteSourceOptions<TItem> {
  /**
   * Get the string value of the suggestion. The value is used to fill the search box.
   */
  getInputValue?({
    suggestion,
    state,
  }: {
    suggestion: Suggestion<TItem>;
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
    suggestion: Suggestion<TItem>;
    state: AutocompleteState<TItem>;
  }): string | undefined;
  /**
   * Function called when the input changes. You can use this function to filter/search the items based on the query.
   */
  getSuggestions(
    options: SuggestionsOptions
  ): Array<Suggestion<TItem>> | Promise<Array<Suggestion<TItem>>>;
  /**
   * Called when an item is selected.
   */
  onSelect?: (options: ItemEventHandlerOptions<TItem>) => void;
}

export interface EventHandlerOptions<TItem> extends AutocompleteSetters<TItem> {
  state: AutocompleteState<TItem>;
}

export interface ItemEventHandlerOptions<TItem>
  extends EventHandlerOptions<TItem> {
  suggestion: Suggestion<TItem>;
  suggestionValue: ReturnType<AutocompleteSource['getInputValue']>;
  suggestionUrl: ReturnType<AutocompleteSource['getSuggestionUrl']>;
  source: AutocompleteSource;
}

interface Navigator {
  /**
   * Called when a URL should be open in the current page.
   */
  navigate: ({
    suggestionUrl: string,
    suggestion: Suggestion,
    state: AutocompleteState,
  }) => void;
  /**
   * Called when a URL should be open in a new tab.
   */
  navigateNewTab: ({
    suggestionUrl: string,
    suggestion: Suggestion,
    state: AutocompleteState,
  }) => void;
  /**
   * Called when a URL should be open in a new window.
   */
  navigateNewWindow: ({
    suggestionUrl: string,
    suggestion: Suggestion,
    state: AutocompleteState,
  }) => void;
}

export interface AutocompleteOptions<TItem> {
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
    options: SuggestionsOptions
  ): AutocompleteSource[] | Promise<AutocompleteSource[]>;
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
  navigator?: Navigator;
  /**
   * The function called to determine whether the dropdown should open.
   */
  shouldDropdownOpen?(options: { state: AutocompleteState<TItem> }): boolean;
}

export type NormalizedAutocompleteSource = {
  [KParam in keyof AutocompleteSource]-?: AutocompleteSource[KParam];
};

export type NormalizedGetSources = (
  options: SuggestionsOptions
) => Promise<NormalizedAutocompleteSource[]>;

// Props manipulated internally with default values.
export interface RequiredAutocompleteOptions<TItem> {
  id: string;
  onStateChange<TItem>(props: { state: AutocompleteState<TItem> }): void;
  placeholder: string;
  defaultHighlightedIndex: number;
  showCompletion: boolean;
  minLength: number;
  stallThreshold: number;
  initialState: AutocompleteState<TItem>;
  getSources: NormalizedGetSources;
  environment: Environment;
  navigator: Navigator;
  shouldDropdownOpen(options: { state: AutocompleteState<TItem> }): boolean;
}
