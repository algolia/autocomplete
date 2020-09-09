import {
  GetSourcesParams,
  AutocompleteSetters as AutocompleteCoreSetters,
  AutocompleteSource as AutocompleteCoreSource,
  AutocompleteState as AutocompleteCoreState,
  PublicAutocompleteOptions as PublicAutocompleteCoreOptions,
  PublicAutocompleteSource as PublicAutocompleteCoreSource,
} from '@algolia/autocomplete-core';

type Template<TParams> = (params: TParams) => string | void;

export type AutocompleteSource<TItem> = AutocompleteCoreSource<TItem> & {
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

type GetSources<TItem> = (
  params: GetSourcesParams<TItem>
) =>
  | Array<PublicAutocompleteCoreSource<TItem>>
  | Promise<Array<PublicAutocompleteCoreSource<TItem>>>;

export interface AutocompleteOptions<TItem>
  extends PublicAutocompleteCoreOptions<TItem> {
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
