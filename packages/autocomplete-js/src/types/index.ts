import {
  AutocompleteOptions as AutocompleteCoreOptions,
  AutocompleteSetters as AutocompleteCoreSetters,
  AutocompleteSource as AutocompleteCoreSource,
  AutocompleteState as AutocompleteCoreState,
  GetSourcesParams,
  InternalAutocompleteSource as InternalAutocompleteCoreSource,
} from '@algolia/autocomplete-core';
import { MaybePromise } from '@algolia/autocomplete-shared';

type Template<TParams> = (params: TParams) => string | void;

/**
 * Templates to display in the autocomplete panel.
 *
 * A template can either return a string, or perform DOM mutations (manipulating DOM elements with JavaScript and attaching events) without returning a string.
 */
export type SourceTemplates<TItem> = {
  /**
   * The template for the suggestion item.
   */
  item: Template<{
    root: HTMLElement;
    item: TItem;
    state: AutocompleteState<TItem>;
  }>;
  /**
   * The template for the section header.
   */
  header?: Template<{
    root: HTMLElement;
    state: AutocompleteState<TItem>;
  }>;
  /**
   * The template for the section footer.
   */
  footer?: Template<{
    root: HTMLElement;
    state: AutocompleteState<TItem>;
  }>;
};

type WithTemplates<TType, TItem> = TType & {
  templates: SourceTemplates<TItem>;
};

export type AutocompleteSource<TItem> = WithTemplates<
  AutocompleteCoreSource<TItem>,
  TItem
>;
export type InternalAutocompleteSource<TItem> = WithTemplates<
  InternalAutocompleteCoreSource<TItem>,
  TItem
>;

interface AutocompleteCollection<TItem> {
  source: InternalAutocompleteSource<TItem>;
  items: TItem[];
}

export type AutocompleteState<TItem> = Omit<
  AutocompleteCoreState<TItem>,
  'collections'
> & {
  collections: Array<AutocompleteCollection<TItem>>;
};

export type AutocompleteClassNames = Partial<{
  root: string;
  form: string;
  label: string;
  inputWrapper: string;
  input: string;
  resetButton: string;
  panel: string;
  panelLayout: string;
  source: string;
  sourceHeader: string;
  list: string;
  item: string;
  sourceFooter: string;
}>;

export type AutocompleteDom = {
  inputWrapper: HTMLDivElement;
  input: HTMLInputElement;
  root: HTMLDivElement;
  form: HTMLFormElement;
  label: HTMLLabelElement;
  resetButton: HTMLButtonElement;
  panel: HTMLDivElement;
};

export type AutocompleteRenderer<TItem> = (params: {
  root: HTMLElement;
  sections: HTMLElement[];
  state: AutocompleteState<TItem>;
}) => void;

export interface AutocompleteOptions<TItem>
  extends AutocompleteCoreOptions<TItem> {
  /**
   * The container for the Autocomplete search box.
   *
   * You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.
   */
  container: string | HTMLElement;
  /**
   * The container for the Autocomplete panel.
   *
   * You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.
   *
   * @default document.body
   */
  panelContainer: string | HTMLElement;
  getSources?: (
    params: GetSourcesParams<TItem>
  ) => MaybePromise<Array<AutocompleteSource<TItem>>>;
  /**
   * The panel horizontal position.
   *
   * @default "input-wrapper-width"
   */
  panelPlacement?: 'start' | 'end' | 'full-width' | 'input-wrapper-width';
  /**
   * The class names to inject in each created DOM element.
   *
   * It it useful to design with external CSS frameworks.
   */
  classNames?: AutocompleteClassNames;
  /**
   * Function called to render the autocomplete results. It is useful for rendering sections in different row or column layouts.
   * The default implementation appends all the sections to the root:
   *
   * ```js
   * autocomplete({
   *   // ...
   *   render({ root, sections }) {
   *     for (const section of sections) {
   *       root.appendChild(section);
   *     }
   *   },
   * });
   * ```
   */
  render?: AutocompleteRenderer<TItem>;
}

export interface AutocompleteApi<TItem> extends AutocompleteCoreSetters<TItem> {
  /**
   * Triggers a search to refresh the state.
   */
  refresh(): Promise<void>;
  /**
   * Cleans up the DOM mutations and event listeners.
   */
  destroy(): void;
}
