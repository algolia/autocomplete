import { MaybePromise } from '@algolia/autocomplete-shared';

import { AutocompleteScopeApi, BaseItem } from './AutocompleteApi';
import { GetSourcesParams } from './AutocompleteOptions';
import { AutocompleteState } from './AutocompleteState';

export interface OnSelectParams<TItem extends BaseItem>
  extends AutocompleteScopeApi<TItem> {
  state: AutocompleteState<TItem>;
  event: any;
  item: TItem;
  itemInputValue: ReturnType<
    InternalAutocompleteSource<TItem>['getItemInputValue']
  >;
  itemUrl: ReturnType<InternalAutocompleteSource<TItem>['getItemUrl']>;
  source: InternalAutocompleteSource<TItem>;
}

export type OnActiveParams<TItem extends BaseItem> = OnSelectParams<TItem>;

export interface AutocompleteSource<TItem extends BaseItem> {
  // This allows flavors to pass other keys to their source.
  // Example: `templates` in the JavaScript API
  // [key: string]: unknown;
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
  onActive?(params: OnHighlightParams<TItem>): void;
  /**
   * Identifier for the source.
   */
  sourceId: string;
}

export type InternalAutocompleteSource<TItem extends BaseItem> = {
  [KParam in keyof AutocompleteSource<TItem>]-?: AutocompleteSource<TItem>[KParam];
};
