import {
  AutocompleteSource as AutocompleteCoreSource,
  InternalAutocompleteSource as InternalAutocompleteCoreSource,
  BaseItem,
} from '@algolia/autocomplete-core';

import { AutocompleteComponents } from './AutocompleteComponents';
import { AutocompleteRenderer, VNode } from './AutocompleteRenderer';
import { AutocompleteState } from './AutocompleteState';

type Template<TParams> = (
  params: TParams &
    AutocompleteRenderer & {
      components: AutocompleteComponents;
    }
) => VNode | string;

/**
 * Templates to display in the autocomplete panel.
 *
 * A template can either return a string, or perform DOM mutations (manipulating DOM elements with JavaScript and attaching events) without returning a string.
 */
export type SourceTemplates<TItem extends BaseItem> = {
  /**
   * A function that returns the template for each item of the source.
   *
   * @link https://autocomplete.algolia.com/docs/templates/#item
   */
  item: Template<{
    item: TItem;
    state: AutocompleteState<TItem>;
  }>;
  /**
   * A function that returns the template for the header (before the list of items).
   *
   * @link https://autocomplete.algolia.com/docs/templates/#header
   */
  header?: Template<{
    state: AutocompleteState<TItem>;
    source: AutocompleteSource<TItem>;
    items: TItem[];
  }>;
  /**
   * A function that returns the template for the footer (after the list of items).
   *
   * @link https://autocomplete.algolia.com/docs/templates/#footer
   */
  footer?: Template<{
    state: AutocompleteState<TItem>;
    source: AutocompleteSource<TItem>;
    items: TItem[];
  }>;
  /**
   * A function that returns the template for when there are no items.
   *
   * @link https://autocomplete.algolia.com/docs/templates/#noresults
   */
  noResults?: Template<{
    state: AutocompleteState<TItem>;
    source: AutocompleteSource<TItem>;
  }>;
};

type WithTemplates<TType, TItem extends BaseItem> = TType & {
  /**
   * A set of templates to customize how sections and their items are displayed.
   *
   * See [**Displaying items with Templates**](templates) for more information.
   *
   * @link https://autocomplete.algolia.com/docs/sources/#templates
   */
  templates: SourceTemplates<TItem>;
};

export interface AutocompleteCoreSourceWithDocs<TItem extends BaseItem>
  extends AutocompleteCoreSource<TItem> {
  /**
   * Identifier for the source.
   *
   * It is used as value for the `data-autocomplete-source-id` attribute of the source `section` container.
   */
  sourceId: string;
}

export type AutocompleteSource<TItem extends BaseItem> = WithTemplates<
  AutocompleteCoreSourceWithDocs<TItem>,
  TItem
>;

export type InternalAutocompleteSource<TItem extends BaseItem> = WithTemplates<
  InternalAutocompleteCoreSource<TItem>,
  TItem
>;
