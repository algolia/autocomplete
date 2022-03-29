import {
  AutocompleteReshapeSource,
  BaseItem,
} from '@algolia/autocomplete-core';

export type AutocompleteReshapeFunction<TParams = unknown> = <
  TItem extends BaseItem
>(
  ...params: TParams[]
) => (
  ...expressions: Array<AutocompleteReshapeSource<TItem>>
) => Array<AutocompleteReshapeSource<TItem>>;
