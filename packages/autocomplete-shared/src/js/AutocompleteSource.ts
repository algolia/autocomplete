import {
  AutocompleteSource as AutocompleteCoreSource,
  InternalAutocompleteSource as InternalAutocompleteCoreSource,
  BaseItem,
} from '../core';

import { AutocompleteComponents } from './AutocompleteComponents';
import {
  AutocompleteRenderer,
  HTMLTemplate,
  VNode,
} from './AutocompleteRenderer';
import { AutocompleteState } from './AutocompleteState';

type Template<TParams> = (
  params: TParams &
    AutocompleteRenderer & {
      components: AutocompleteComponents;
      html: HTMLTemplate;
    }
) => VNode | VNode[] | string;

/**
 * Templates to display in the autocomplete panel.
 *
 * A template can either return a string, or perform DOM mutations (manipulating DOM elements with JavaScript and attaching events) without returning a string.
 */
export type SourceTemplates<TItem extends BaseItem> = {
  /**
   * A function that returns the template for each item of the source.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/templates/#param-item
   */
  item: Template<{
    item: TItem;
    state: AutocompleteState<TItem>;
  }>;
  /**
   * A function that returns the template for the header (before the list of items).
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/templates/#param-header
   */
  header?: Template<{
    state: AutocompleteState<TItem>;
    source: AutocompleteSource<TItem>;
    items: TItem[];
  }>;
  /**
   * A function that returns the template for the footer (after the list of items).
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/templates/#param-footer
   */
  footer?: Template<{
    state: AutocompleteState<TItem>;
    source: AutocompleteSource<TItem>;
    items: TItem[];
  }>;
  /**
   * A function that returns the template for when there are no items.
   *
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/templates/#param-noresults
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
   * @link https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/sources/#param-templates
   */
  templates: SourceTemplates<TItem>;
};

export interface AutocompleteCoreSourceWithDocs<TItem extends BaseItem>
  extends AutocompleteCoreSource<TItem> {
  /**
   * Unique identifier for the source.
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
