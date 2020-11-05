import {
  GetSourcesParams,
  AutocompleteSetters as AutocompleteCoreSetters,
  InternalAutocompleteSource as InternalAutocompleteCoreSource,
  AutocompleteState as AutocompleteCoreState,
  AutocompleteOptions as AutocompleteCoreOptions,
  AutocompleteSource as AutocompleteCoreSource,
} from '@algolia/autocomplete-core';
import { MaybePromise } from '@algolia/autocomplete-shared';

type Template<TParams> = (params: TParams) => string | void;

export type SourceTemplates<TItem> = {
  /**
   * Templates to display in the autocomplete dropdown.
   *
   * A template can either return a string, or perform DOM mutations (manipulating DOM elements with JavaScript and attaching events) without returning a string.
   */
  templates: {
    /**
     * The template for the suggestion item.
     */
    item: Template<{
      root: HTMLElement;
      item: TItem;
      state: AutocompleteCoreState<TItem>;
    }>;
    /**
     * The template for the section header.
     */
    header?: Template<{
      root: HTMLElement;
      state: AutocompleteCoreState<TItem>;
    }>;
    /**
     * The template for the section footer.
     */
    footer?: Template<{
      root: HTMLElement;
      state: AutocompleteCoreState<TItem>;
    }>;
  };
};

export type AutocompleteSource<TItem> = AutocompleteCoreSource<TItem> &
  SourceTemplates<TItem>;

export type InternalAutocompleteSource<TItem> = InternalAutocompleteCoreSource<
  TItem
> &
  SourceTemplates<TItem>;

type GetSources<TItem> = (
  params: GetSourcesParams<TItem>
) => MaybePromise<Array<AutocompleteCoreSource<TItem>>>;

export interface AutocompleteOptions<TItem>
  extends AutocompleteCoreOptions<TItem> {
  /**
   * The container for the autocomplete search box.
   *
   * You can either pass a [CSS selector](https://developer.mozilla.org/docs/Web/CSS/CSS_Selectors) or an [Element](https://developer.mozilla.org/docs/Web/API/HTMLElement). The first element matching the provided selector will be used as container.
   */
  container: string | HTMLElement;
  getSources: GetSources<TItem>;
  /**
   * The dropdown horizontal position.
   *
   * @default "input-wrapper-width"
   */
  dropdownPlacement?: 'start' | 'end' | 'full-width' | 'input-wrapper-width';
  /**
   * The class names to inject in each created DOM element.
   *
   * It it useful to design with external CSS frameworks.
   */
  classNames?: {
    root?: string;
    form?: string;
    label?: string;
    inputWrapper?: string;
    input?: string;
    resetButton?: string;
    panel?: string;
    source?: string;
    sourceHeader?: string;
    list?: string;
    item?: string;
    sourceFooter?: string;
  };
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
  render?(params: {
    root: HTMLElement;
    sections: HTMLElement[];
    state: AutocompleteCoreState<TItem>;
  }): void;
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
