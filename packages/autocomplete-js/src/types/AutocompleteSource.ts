import {
  AutocompleteSource as AutocompleteCoreSource,
  InternalAutocompleteSource as InternalAutocompleteCoreSource,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteState } from './AutocompleteState';

type Template<TParams> = (params: TParams) => string | void;

/**
 * Templates to display in the autocomplete panel.
 *
 * A template can either return a string, or perform DOM mutations (manipulating DOM elements with JavaScript and attaching events) without returning a string.
 */
export type SourceTemplates<TItem extends BaseItem> = {
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
    source: AutocompleteSource<TItem>;
    items: TItem[];
  }>;
  /**
   * The template for the section footer.
   */
  footer?: Template<{
    root: HTMLElement;
    state: AutocompleteState<TItem>;
    source: AutocompleteSource<TItem>;
    items: TItem[];
  }>;
};

type WithTemplates<TType, TItem extends BaseItem> = TType & {
  templates: SourceTemplates<TItem>;
};

export type AutocompleteSource<TItem extends BaseItem> = WithTemplates<
  AutocompleteCoreSource<TItem>,
  TItem
>;
export type InternalAutocompleteSource<TItem extends BaseItem> = WithTemplates<
  InternalAutocompleteCoreSource<TItem>,
  TItem
>;
